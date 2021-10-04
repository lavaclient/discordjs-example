import { command, Command, CommandContext, Utils } from "@lib";

@command({ name: "nightcore", description: "Enabled the nightcore filter in this guild." })
export default class Nightcore extends Command {
    async exec(ctx: CommandContext) {
        /* check if there is a player for this guild. */
        const player = ctx.player
        if (!player?.connected) {
            return ctx.reply(Utils.embed("There's no active player for this guild."), { ephemeral: true });
        }

        /* toggle the nightcore filter. */
        player.filters.timescale = (player.nightcore = !player.nightcore)
            ? { speed: 1.125, pitch: 1.125, rate: 1 }
            : undefined;

        await player.setFilters();
        return ctx.reply(Utils.embed(`${player.nightcore ? "Enabled" : "Disabled"} the **nightcore** filter!`));
    }
}
