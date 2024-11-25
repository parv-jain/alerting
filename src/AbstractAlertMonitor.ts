import AbstractTrigger from './AbstractTrigger';
import IMonitor from './IMonitor';

export default abstract class AbstractAlertMonitor implements IMonitor {
    abstract name: string;
    abstract logger: unknown;
    abstract refreshMetricsFrequency: number;
    abstract checkFrequency: number;
    abstract triggers: AbstractTrigger[];
    abstract runQuery(): Promise<unknown>;
    abstract refreshMetrics(): void;

    public startMonitoring(): void {
        if (!this.checkFrequency) {
            throw new Error('checkFrequency cannot be falsy');
        } else if (!Number.isInteger(this.checkFrequency)) {
            throw new Error('checkFrequency can only be an integer.');
        } else if (this.checkFrequency <= 0) {
            throw new Error(
                'checkFrequency cannot be less than or equal to zero',
            );
        } else if (!this.refreshMetricsFrequency) {
            throw new Error('refreshMetricsFrequency cannot be falsy');
        } else if (!Number.isInteger(this.refreshMetricsFrequency)) {
            throw new Error('refreshMetricsFrequency can only be an integer.');
        } else if (this.refreshMetricsFrequency <= 0) {
            throw new Error(
                'refreshMetricsFrequency cannot be less than or equal to zero',
            );
        }
        setInterval(async () => {
            const queryResults = await this.runQuery();
            for (const trigger of this.triggers) {
                if (trigger.isTriggered(queryResults)) {
                    await trigger.takeAction(queryResults);
                }
            }
        }, this.checkFrequency);
        setInterval(() => {
            this.refreshMetrics();
        }, this.refreshMetricsFrequency);
    }
}
