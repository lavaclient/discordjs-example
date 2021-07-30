import { command, Command, CommandContext, Utils } from "@lib";

@command({ name: "ping", description: "Shows the latency of the bot." })
export default class Ping extends Command {
    exec(ctx: CommandContext) {
        ctx.reply(Utils.embed(`Pong! **Heartbeat:** *${Math.round(ctx.client.ws.ping)}ms*`), { ephemeral: true });
    }
}