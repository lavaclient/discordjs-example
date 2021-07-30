import { QueuePlugin } from "@lavaclient/queue";
import { Client, Collection } from "discord.js";
import { Manager } from "lavaclient";

import { Command } from "./Command";
import { Queue } from "./Queue";

const LAVALINK_NODE = { id: "a", host: process.env.LAVA_HOST!, password: process.env.LAVA_PASS!, port: 2333 }

export class Bot extends Client {
    readonly music: Manager;
    readonly commands: Collection<`${bigint}`, Command> = new Collection();

    constructor() {
        super({
            intents: [ "GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES" ]
        });

        this.music = new Manager([ LAVALINK_NODE ], {
            send: (id, payload) => this.guilds.cache.get(id as `${bigint}`)?.shard?.send(payload),
            plugins: [ new QueuePlugin(Queue) ]
        });

        this.ws.on("VOICE_SERVER_UPDATE", data => this.music.serverUpdate(data));
        this.ws.on("VOICE_STATE_UPDATE", data => this.music.stateUpdate(data));
    }
}

declare module "discord.js" {
    interface Client {
        readonly music: Manager
    }
}
