import IDestination from './IDestination';

export default abstract class AbstractAction {
    abstract name: string;
    abstract message: string;
    abstract destination: IDestination;

    execute(options?: any): Promise<boolean> {
        return this.destination.sendMessage(this.message, options);
    }
}