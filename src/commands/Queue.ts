import { command, Command, CommandContext, Utils } from "@lib";

const formatIndex = (index: number, size: number) => (index + 1).toString().padStart(size.toString().length, "0")

@command({ name: "queue", description: "Shows the tracks that are in the queue." })
export default class Queue extends Command {
    async exec(ctx: CommandContext) {
        /* check if a player exists for this guild. */
        const player = ctx.client.music.players.get(ctx.guild!.id);
        if (!player?.connected) {
            return ctx.reply(Utils.embed("I couldn't find a player for this guild."), { ephemeral: true });
        }

        /* check if the queue is empty. */
        if (!player.queue.tracks.length) {
            return ctx.reply(Utils.embed("There are no tracks in the queue."));
        }

        /* respond with an embed of the queue. */
        const size = player.queue.tracks.length;
        const str = player.queue.tracks
            .map((t, idx) => `\`#${formatIndex(idx, size)}\` [**${t.title}**](${t.uri}) ${t.requester ? `<@${t.requester}>` : ""}`)
            .join("\n");

        return ctx.reply(Utils.embed({
            description: str,
            title: `Queue for **${ctx.guild?.name}**`
        }));
    }
}