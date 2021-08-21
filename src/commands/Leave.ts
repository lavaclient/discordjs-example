import { command, Command, CommandContext, Utils } from "@lib";

@command({ name: "leave", description: "Leaves the VC that the bot is currently in." })
export default class Leave extends Command {
    async exec(ctx: CommandContext) {
        /* check if a player exists for this guild. */
        const player = ctx.client.music.players.get(ctx.guild!.id);
        if (!player?.connected) {
            return ctx.reply(Utils.embed("I couldn't find a player for this guild."), { ephemeral: true });
        }

        /* check if the user is in the player's voice channel. */
        const vc = ctx.guild?.voiceStates?.cache?.get(ctx.user.id)?.channel;
        if (!vc || player.channelId !== vc.id) {
            return ctx.reply(Utils.embed("You're not in my voice channel, bozo."), { ephemeral: true });
        }

        await ctx.reply(Utils.embed(`Left <#${player.channelId}>`));

        /* leave the player's voice channel. */
        player.disconnect();
        ctx.client.music.destroyPlayer(player.guildId);
    }
}
