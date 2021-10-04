import { command, Command, CommandContext, Utils } from "@lib";

@command({ 
    name: "remove", 
    description: "Removes a track from the queue.",
    options: [
        {
            name: "index",
            description: "The index of the track to remove.",
            type: "INTEGER",
            required: true
        }
    ]
})
export default class Remove extends Command {
    async exec(ctx: CommandContext, { index }: { index: number }) {
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

        /* remove the track from the queue. */ 
        const removedTrack = player.queue.remove(index - 1);
        if (!removedTrack) {
            /* no track was removed. */
            return ctx.reply(Utils.embed("No tracks were removed."), { ephemeral: true });
        }

        return ctx.reply(Utils.embed(`The track [**${removedTrack.title}**](${removedTrack.uri}) was removed.`));
    }
}