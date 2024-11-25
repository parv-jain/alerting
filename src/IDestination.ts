export enum DestinationType {
    STD_OUT = 'STD_OUT',
    SLACK = 'SLACK',
    EMAIL = 'EMAIL',
}

/**
 * Use Destinations for different kind of destinations like stdout, slack, ES, etc.
 * @method execute should implement the logic for sending the message.
 */
export default interface IDestination {
    name: string;
    type: DestinationType;
    sendMessage(message: string, params?: unknown): Promise<boolean>;
}
