import { config } from './config';
import { ErrorMonitor } from './monitoring';
import { Logging } from './toolbox';

const logger = new Logging({
    name: 'Alerting and Monitoring',
    tags: config.errormonitor.tags,
}).createLogger();

const errorMonitoInstance = new ErrorMonitor({ logger });
errorMonitoInstance.startMonitoring();

logger.info('Alerting and Monitoring service started');
