export const config = {
    errormonitor: {
        tags: ['second-brain-server', 'error-monitor'],
    },
    kibana: {
        url: 'https://kibana.second-brain.in',
        username: 'elastic',
        password: '5pg4fWCU8MmaLpSF',
        devToolsProxyPath:
            '/api/console/proxy?path=logstash-*%2F_search&method=GET',
        discoverPath: '/app/discover#/',
    },
    slack: {
        webhookUrl:
            'https://hooks.slack.com/services/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',
    },
};
