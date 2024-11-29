import axios from 'axios';

import Logger from 'bunyan';
import { config } from '../../config';
import { AbstractAlertMonitor, AbstractTrigger } from '../../toolbox';
import { ErrorTrigger } from '..';

export class ErrorMonitor extends AbstractAlertMonitor {
    public name: string;

    public refreshMetricsFrequency: number;

    public checkFrequency: number;

    public triggers: AbstractTrigger[];

    public logger: Logger;

    constructor(props: { logger: Logger }) {
        super();
        this.name = this.constructor.name;
        this.logger = props.logger;
        this.triggers = [
            new ErrorTrigger({
                logger: this.logger,
                message: `[${this.name}] - You've got non-zero errors`,
            }),
        ];
        this.checkFrequency = 5 * 60 * 1000; // every 5 minutes
        this.refreshMetricsFrequency = 60 * 60 * 1000; // every one hour
    }

    public refreshMetrics(): void {
        // Not needed for this monitor
    }

    public async runQuery(): Promise<unknown> {
        this.logger.info(
            `${[this.constructor.name]} - Running query to fetch error logs from elasticsearch`,
        );
        const metrics = await this.queryElasticsearch();
        return new Promise((resolve) => resolve(metrics.hits));
    }

    private queryElasticsearch = async () => {
        const kibanaUrl = config.kibana.url;
        const apiPath = config.kibana.devToolsProxyPath;

        const token = Buffer.from(
            `${config.kibana.username}:${config.kibana.password}`,
        ).toString('base64');
        const headers = {
            'kbn-xsrf': 'true',
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json',
        };

        const body = {
            query: {
                bool: {
                    must: [],
                    filter: [
                        {
                            range: {
                                '@timestamp': {
                                    gte: 'now-5m',
                                    lte: 'now',
                                    format: 'strict_date_optional_time',
                                },
                            },
                        },
                        {
                            match_phrase: {
                                'log.level': 'ERROR',
                            },
                        },
                    ],
                    should: [],
                    must_not: [],
                },
            },
            size: 1,
        };

        try {
            const response = await axios.post(`${kibanaUrl}${apiPath}`, body, {
                headers,
            });
            return response.data;
        } catch (err) {
            this.logger.error(err, 'Error querying elasticsearch via kibana');
        }
    };
}
