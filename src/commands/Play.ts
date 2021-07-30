import { command, Command, MessageChannel, PRIMARY_COLOR } from "@lib";
import { CommandInteraction, MessageEmbed } from "discord.js";

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
    async exec(interaction: CommandInteraction, { query }: { query: string }) {
        const vc = interaction.guild?.voiceStates?.cache?.get(interaction.user.id)?.channel
        if (!vc) {
            return interaction.reply({ content: "join a voice channel bozo", ephemeral: true });
        }

        let player = interaction.client.music.players.get(interaction.guildId!);
        if (player && player.channel !== vc.id) {
            return interaction.reply({ content: `join <#${player.channel}> bozo`, ephemeral: true });
        }

        const results = await interaction.client.music.search(/^https?:\/\//.test(query) 
            ? query 
            : `ytsearch:${query}`);

        let tracks: Addable[] = [], msg: string = "";
        switch (results.loadType) {
            case "LOAD_FAILED":
            case "NO_MATCHES": 
                return interaction.reply({content: "uh oh something went wrong", ephemeral: true});
            case "PLAYLIST_LOADED":
                tracks = results.tracks; 
                msg = `Queued playlist [**${results.playlistInfo.name}**](${query}), it has a total of **${tracks.length}** tracks.`;
                break
            case "TRACK_LOADED":
            case "SEARCH_RESULT":
                const [track] = results.tracks;
                tracks = [ track ];
                msg = `Queued [**${track.info.title}**](${track.info.uri})`;
                break;
        }

        /* create and/or join the member's vc. */
        if (!player?.connected) {
            player ??= interaction.client.music.create(interaction.guildId!);
            player.queue.channel = interaction.channel as MessageChannel;
            await player.connect(vc.id, { selfDeaf: true });
        }

        /* do queue tings. */
        player.queue.add(tracks, interaction.user.id);
        if (!player.queue.started) {
            await player.queue.start()
        }

        /* reply with the queued message. */
        await interaction.reply({
            ephemeral: player.queue.started || results.loadType === "PLAYLIST_LOADED",
            embeds: [ new MessageEmbed()
                .setColor(PRIMARY_COLOR)
                .setDescription(msg) ]
        });
    }
}