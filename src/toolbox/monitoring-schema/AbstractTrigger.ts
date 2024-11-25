import AbstractAction from './AbstractAction';

export default abstract class AbstractTrigger {
    abstract name: string;
    abstract actions: AbstractAction[];
    abstract isTriggered(queryResults: unknown): boolean;

    public takeAction(queryResults: unknown): Promise<unknown> {
        return Promise.all(
            this.actions.map((action) => action.execute(queryResults)),
        );
    }
}
