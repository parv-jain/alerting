import axios from 'axios';

import Logger from 'bunyan';
import { DestinationType, IDestination } from '../../toolbox';
import { config } from '../../config';

export class Slack implements IDestination {
    logger: Logger;

    name: string;

    type: DestinationType;

    constructor(logger: Logger) {
        this.name = this.constructor.name;
        this.type = DestinationType.SLACK;
        this.logger = logger;
    }

    async sendMessage(
        message: string,
        queryResults: {
            total: { value: number };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            hits: any[];
        },
    ): Promise<boolean> {
        try {
            const keysToInclude = [
                'kubernetes.container.name',
                'kubernetes.namespace',
                'log.msg',
                'log.level',
                'tags',
            ];

            const totalErrors = queryResults.hits.length;

            const formattedResults = queryResults.hits
                .slice(0, 5)
                .map((hit, index) => {
                    const { _source } = hit;

                    // Filter and format only required keys
                    const filteredFields = keysToInclude
                        .map((key) => {
                            const value = key
                                .split('.')
                                .reduce((obj, k) => obj?.[k], _source); // Access nested keys
                            return value !== undefined
                                ? `> *${key}*: ${value}`
                                : null; // Include only if value exists
                        })
                        .filter((line) => line) // Remove null/undefined lines
                        .join('\n');

                    return `*Result ${index + 1}:*\n${filteredFields}`;
                })
                .join('\n\n');

            const kibanaQueryParams = new URLSearchParams({
                _g: `(filters:!(),refreshInterval:(pause:!t,value:60000),time:(from:now-5m,to:now))`,
                _a: `(columns:!(kubernetes.container.name,kubernetes.namespace,log.msg,tags,log.level),dataSource:(dataViewId:bf4b853a-572f-42bc-bc24-8f39c9fa23fd,type:dataView),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:fcada783-8d08-4b06-9c59-a5c238162521,key:log.level.keyword,negate:!f,params:(query:ERROR),type:phrase),query:(match_phrase:(log.level.keyword:ERROR)))),index:fcada783-8d08-4b06-9c59-a5c238162521,interval:auto,query:(language:kuery,query:''),sort:!(!('@timestamp',desc)))`,
            }).toString();

            const kibanaLink = `${config.kibana.url}${config.kibana.discoverPath}?${kibanaQueryParams}`;

            const slackMessage = {
                text: `*${message}*\n\nTotal Errors: ${totalErrors}\n\n${formattedResults}\n\n<${kibanaLink}|View in Kibana>`,
            };

            await axios.post(config.slack.webhookUrl, slackMessage);

            return true;
        } catch (err) {
            this.logger.error(
                err,
                'Error formatting and sending elasticsearch query results to slack',
            );
            return false;
        }
    }
}
