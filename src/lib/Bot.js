import { Client, Collection, Snowflake } from "discord.js";
import { Node } from "lavaclient";

import { Command } from "./command/Command";

export class Bot extends Client {
    constructor() {
        super({
            intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
        });

        /** @type {Collection<Snowflake, Command>} */
        this.commands = new Collection()

        this.music = new Node({
            sendGatewayPayload: (id, payload) => this.guilds.cache.get(id)?.shard?.send(payload),
            connection: {
                host: String(process.env.LAVA_HOST),
                password: String(process.env.LAVA_PASS),
                port: 2333
            }
        });

        this.ws.on("VOICE_SERVER_UPDATE", data => this.music.handleVoiceUpdate(data));
        this.ws.on("VOICE_STATE_UPDATE", data => this.music.handleVoiceUpdate(data));
    }
}