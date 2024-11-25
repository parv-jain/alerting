import Logger from 'bunyan';
import { AbstractAction, IDestination } from '../../toolbox';
import { Slack } from '..';

export class ErrorAlertAction extends AbstractAction {
    public name: string;

    public message: string;

    public destination: IDestination;

    constructor(props: { logger: Logger; message: string }) {
        super();
        this.name = this.constructor.name;
        this.message = props.message;
        this.destination = new Slack(props.logger);
    }

    execute(queryResults: {
        total: { value: number };
        hits: unknown[];
    }): Promise<boolean> {
        return this.destination.sendMessage(this.message, queryResults);
    }
}
