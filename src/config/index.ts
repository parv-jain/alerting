import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
    errormonitor: {
        tags: process.env.ERROR_MONITOR_TAGS?.split(',') || ['default-tag'],
    },
    kibana: {
        url: process.env.KIBANA_URL || '',
        username: process.env.KIBANA_USERNAME || '',
        password: process.env.KIBANA_PASSWORD || '',
        devToolsProxyPath: process.env.KIBANA_DEV_TOOLS_PROXY_PATH || '',
        discoverPath: process.env.KIBANA_DISCOVER_PATH || '',
    },
    slack: {
        webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
    },
};
