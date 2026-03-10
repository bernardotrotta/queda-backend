/**
 * Base class for standardizing application messages.
 */
class Message {
    /**
     * @param {string} message - A human-readable message description.
     * @param {any} details - Additional data payload associated with the message.
     */
    constructor(message, details) {
        this.message = message
        this.payload = details
    }
}

/**
 * Standard message format for successful operations.
 */
class SuccessMessage extends Message {
    /**
     * @param {any} [payload] - Optional data payload to include in the success message.
     */
    constructor(payload) {
        super('Success', payload)
    }
}

export { Message, SuccessMessage }
