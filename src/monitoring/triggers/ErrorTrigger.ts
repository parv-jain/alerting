import Logger from 'bunyan';
import { AbstractAction, AbstractTrigger } from '../../toolbox';
import { ErrorAlertAction } from '..';

export class ErrorTrigger extends AbstractTrigger {
    public name: string;

    public actions: AbstractAction[];

    constructor(props: { logger: Logger; message: string }) {
        super();
        this.name = this.constructor.name;
        this.actions = [
            new ErrorAlertAction({
                logger: props.logger,
                message: props.message,
            }),
        ];
    }

    public isTriggered(queryResults: {
        total: { value: number };
        hits: unknown[];
    }): boolean {
        return queryResults?.total?.value > 0;
    }
}
