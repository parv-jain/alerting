import axios from 'axios';

import Logger from 'bunyan';
import { config } from '../../config';
import { AbstractAlertMonitor, AbstractTrigger, Logging } from '../../toolbox';
import { ErrorTrigger } from '..';

export class ErrorMonitor extends AbstractAlertMonitor {
    public name: string;

    public refreshMetricsFrequency: number;

    public checkFrequency: number;

    public triggers: AbstractTrigger[];

    public logger: Logger;

    constructor() {
        super();
        this.name = this.constructor.name;
        this.logger = new Logging({
            name: this.name,
            tags: config.errormonitor.tags,
        }).createLogger();
        this.triggers = [
            new ErrorTrigger({
                logger: this.logger,
                message: `[${this.name}] Triggered`,
            }),
        ];
        this.checkFrequency = 10 * 1000; // every minute
        this.refreshMetricsFrequency = 60 * 60 * 1000; // every one hour
    }

    public refreshMetrics(): void {
        // handled at time of runQuery itself
    }

    public async runQuery(): Promise<unknown> {
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
                    ],
                    should: [],
                    must_not: [],
                },
            },
        };

        try {
            const response = await axios.post(`${kibanaUrl}${apiPath}`, body, {
                headers,
            });
            return response.data;
        } catch (err) {
            this.logger.error(err, 'Error querying Elasticsearch');
        }
    };
}
