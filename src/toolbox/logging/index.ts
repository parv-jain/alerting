import Logger, { stdSerializers } from 'bunyan';

export class Logging {
    private name: string;

    private tags: string[];

    constructor(props: { name: string; tags: string[] }) {
        this.name = props.name;
        this.tags = props.tags;
    }

    public createLogger(): Logger {
        return Logger.createLogger({
            name: this.name,
            tags: this.tags,
            serializers: {
                ...stdSerializers,
            },
            streams: [
                {
                    level: Logger.levelFromName.info,
                    stream: {
                        write: (record: unknown) => {
                            // Parse the record if it's a string
                            const log = typeof record === 'string' ? JSON.parse(record) : record;

                            // Map level number to string
                            log.level = Logger.nameFromLevel[log.level];

                            // Write the transformed log back to stdout
                            process.stdout.write(JSON.stringify(log) + '\n');
                        },
                    },
                    type: 'raw', // Keep the raw log object
                },
            ],
        });
    }
}
