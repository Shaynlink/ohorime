const { EXPERIENCES_WORKER_TYPE } = require('../utils/constant');

class MessageCreateEvent {
    constructor(client) {
        this.client = client;
        this.name = 'messageCreate';
        this.listenerType = 'on';
    }

    handler(message) {
        this.experiences(message);
    }

    experiences(message) {
        this.client.experiencesWorker.postMessage(
            [
                EXPERIENCES_WORKER_TYPE.messageCreate,
                message.author.id,
                message.guildId,
                message.content
            ]
        )
    }
}

module.exports = MessageCreateEvent;
