import Logger from 'bunyan';
import { DestinationType, IDestination } from '../../toolbox';

export class Slack implements IDestination {
    logger: Logger;

    name: string;

    type: DestinationType;

    constructor(logger: Logger) {
        this.name = this.constructor.name;
        this.type = DestinationType.SLACK;
        this.logger = logger;
    }

    sendMessage(
        message: string,
        options: Record<string, unknown>,
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.logger.info({ ...options }, message);
            resolve(true);
        });
    }
}
