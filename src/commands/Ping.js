import { Command, Utils } from "../lib";

export default class Ping extends Command {
    constructor() {
        super({ name: "ping", description: "Shows the latency of the bot." });
    }

    exec(ctx) {
        ctx.reply(Utils.embed(`Pong! **Heartbeat:** *${Math.round(ctx.client.ws.ping)}ms*`), { ephemeral: true });
    }
}