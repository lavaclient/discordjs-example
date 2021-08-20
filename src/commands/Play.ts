import { command, Command, CommandContext, MessageChannel, Utils } from "@lib";

import type { Addable } from "@lavaclient/queue";

@command({
    name: "play",
    description: "Plays a song in the current vc.",
    options: [
        {
            name: "query",
            description: "The search query.",
            type: "STRING",
            required: true
        }
    ]
})
export default class Play extends Command {
    async exec(ctx: CommandContext, { query }: { query: string }) {
        /* check if the invoker is in a vc. */
        const vc = ctx.guild?.voiceStates?.cache?.get(ctx.user.id)?.channel
        if (!vc) {
            return ctx.reply(Utils.embed("Join a voice channel bozo"), { ephemeral: true });
        }

        /* check if a player already exists, if so check if the invoker is in our vc. */
        let player = ctx.client.music.players.get(ctx.guild!.id);
        if (player && player.channelId !== vc.id) {
            return ctx.reply(Utils.embed(`Join <#${player.channelId}> bozo`), { ephemeral: true });
        }

        const results = await ctx.client.music.rest.loadTracks(/^https?:\/\//.test(query)
            ? query
            : `ytsearch:${query}`);

        let tracks: Addable[] = [], msg: string = "";
        switch (results.loadType) {
            case "LOAD_FAILED":
            case "NO_MATCHES":
                return ctx.reply({ content: "uh oh something went wrong", ephemeral: true });
            case "PLAYLIST_LOADED":
                tracks = results.tracks;
                msg = `Queued playlist [**${results.playlistInfo.name}**](${query}), it has a total of **${tracks.length}** tracks.`;
                break
            case "TRACK_LOADED":
            case "SEARCH_RESULT":
                const [track] = results.tracks;
                tracks = [track];
                msg = `Queued [**${track.info.title}**](${track.info.uri})`;
                break;
        }

        /* create and/or join the member's vc. */
        if (!player?.connected) {
            player ??= ctx.client.music.createPlayer(ctx.guild!.id);
            player.queue.channel = ctx.channel as MessageChannel;
            await player.connect(vc.id, { deafened: true });
        }

        /* reply with the queued message. */
        const started = player.playing || player.paused;
        await ctx.reply(Utils.embed(msg), { ephemeral: !started });

        /* do queue tings. */
        player.queue.add(tracks, ctx.user.id);
        if (!started) {
            await player.queue.start()
        }
    }
}
