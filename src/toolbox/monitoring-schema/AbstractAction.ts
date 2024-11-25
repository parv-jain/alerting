import IDestination from './IDestination';

export default abstract class AbstractAction {
    abstract name: string;
    abstract message: string;
    abstract destination: IDestination;

    execute(options?: unknown): Promise<boolean> {
        return this.destination.sendMessage(this.message, options);
    }
}
