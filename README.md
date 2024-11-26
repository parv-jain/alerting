# Alerting Service
### Overview
The Alerting Service is a modular system designed to monitor and act upon specific conditions in real-time. It consists of four core components:

### Monitors
Monitors execute queries at defined intervals to fetch data from a data source (e.g., Elasticsearch). The results of these queries are passed on to triggers for evaluation.

### Triggers
Triggers evaluate the query results against predefined conditions. If the condition is met, the trigger forwards the query results to the corresponding action.

### Actions
Actions define how to process the results from the triggers. For example, they might format the data and prepare it for delivery to a specific destination.

### Destinations
Destinations are the endpoints where alerts are sent. These could include messaging platforms like Slack, email services, or other notification systems.

### Current Implementation: ErrorMonitor
The service includes an ErrorMonitor, which performs the following tasks:

- Queries Elasticsearch to fetch log data containing errors.
- Runs every 5 minutes to check for errors (log.level: ERROR) in the logs.
- If the number of error hits (hits.count) is greater than 0:
- Formats the results.
- Sends a detailed alert to a configured Slack webhook, including a link to view the logs in Kibana.

## Environment Setup
Copy the .env.sample file to create a .env file:

```
cp .env.sample .env
```

Update the .env file with your specific configuration:

```
ERROR_MONITOR_TAGS=second-brain-server,error-monitor
KIBANA_URL=https://your-kibana-url
KIBANA_USERNAME=your-kibana-username
KIBANA_PASSWORD=your-kibana-password
KIBANA_DEV_TOOLS_PROXY_PATH=/api/console/proxy?path=logstash-*%2F_search&method=GET
KIBANA_DISCOVER_PATH=/app/discover#/
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your-slack-webhook-url
```

## Installation
Install dependencies:

```
npm install
```

Run the application:

```
npm run start
```

## Deployment on Kubernetes

```
cd alerting
```

Build Image

```
docker build -t alerting:latest .
```

Update app-config.yaml with actual env values

Deploy config map
```
kubectl apply -f app-config.yaml -n your_namespace
```

Deploy app as container
```
kubectl apply -f deployment.yaml -n your_namespace
```