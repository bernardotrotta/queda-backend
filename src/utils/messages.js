class Message {
    constructor(message, details) {
        this.message = message
        this.payload = details
    }
}

class SuccessMessage extends Message {
    constructor(payload) {
        super('Success', payload)
    }
}

export { Message, SuccessMessage }
