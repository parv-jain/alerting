import AbstractAction from "./AbstractAction";

export default abstract class AbstractTrigger {
    abstract name: string;
    abstract actions: AbstractAction[];
    abstract isTriggered(queryResults: any): boolean;
    
    public takeAction(queryResults: any): Promise<any> {
        return Promise.all(this.actions.map((action) => action.execute(queryResults)));
    }
}