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
            tags: config.errorMonitor.tags,
        }).createLogger();
        this.triggers = [
            new ErrorTrigger({
                logger: this.logger,
                message: `[${this.name}] Triggered`,
            }),
        ];
        this.checkFrequency = 60 * 1000; // every minute
        this.refreshMetricsFrequency = 60 * 60 * 1000; // every one hour
    }
    async run() {
        console.log('ErrorMonitor');
    }

    public refreshMetrics(): void {
        // handled at time of runQuery itself
    }

    public runQuery(): Promise<unknown> {
        const metrics = {};
        return new Promise((resolve) => resolve(metrics));
    }
}
