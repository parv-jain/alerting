import { Logging } from './toolbox';
import { AbstractAlertMonitor } from './toolbox';
import fs from 'fs';
import path from 'path';
import { config } from './config';

const logger = new Logging({
    name: 'Alerting and Monitoring',
    tags: config.errormonitor.tags,
}).createLogger();

// Function to dynamically load all monitors extending AbstractAlertMonitor
async function loadMonitors(directory: string): Promise<AbstractAlertMonitor[]> {
    const monitors: AbstractAlertMonitor[] = [];
    const files = fs.readdirSync(directory);

    for (const file of files) {
        if (file.endsWith('.js') || file.endsWith('.ts')) {
            const monitorPath = path.join(directory, file);
            try {
                const module = await import(monitorPath);
                const MonitorClass = module[file.split('.')[0]] || module;

                // Check if MonitorClass extends AbstractAlertMonitor
                if (
                    typeof MonitorClass === 'function' &&
                    Object.getPrototypeOf(MonitorClass.prototype).constructor === AbstractAlertMonitor
                ) {
                    monitors.push(
                        new MonitorClass({
                            logger,
                        }),
                    );
                } else {
                    logger.warn(`${file} is not a valid monitor.`);
                }
            } catch (err) {
                logger.error(err, 'Failed to load monitor from ${file}');
            }
        }
    }

    return monitors;
}

// Main function to initialize and start monitoring
(async () => {
    const monitoringDir = path.join(__dirname, 'monitoring/monitors'); // Adjust path for your project
    const monitors = await loadMonitors(monitoringDir);

    if (monitors.length === 0) {
        logger.warn('No monitors found to start.');
        return;
    }

    monitors.forEach((monitor) => {
        try {
            monitor.startMonitoring();
            logger.info(`Started monitoring for ${monitor.constructor.name}`);
        } catch (err) {
            logger.error(
                err,
                `Failed to start monitoring for ${monitor.constructor.name}`,
            );
        }
    });

    logger.info('Alerting and Monitoring service started.');
})();
