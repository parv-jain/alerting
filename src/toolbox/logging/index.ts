import Logger from 'bunyan';

export class Logging {
    private name: string;

    private tags: string[];

    constructor(props: { name: string; tags: string[] }) {
        this.name = props.name;
        this.tags = props.tags;
    }

    public createLogger(): Logger {
        return Logger.createLogger({ name: this.name, tags: this.tags });
    }
}
