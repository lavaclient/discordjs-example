import { command, Command, MessageChannel, PRIMARY_COLOR } from "@lib";
import { CommandInteraction, MessageEmbed } from "discord.js";

@command({ name: "join", description: "Joins the member's voice channel." })
export default class Join extends Command {
    async exec(interaction: CommandInteraction) {
        const vc = interaction.guild?.voiceStates?.cache?.get(interaction.user.id)?.channel
        if (!vc) {
            return interaction.reply("join a voice channel noob");
        }

        const player = interaction.client.music.create(vc.guild.id);
        if (player.connected) {
            return interaction.reply("i'm already connected to a vc.");
        }

        /* set the queue channel. */
        player.queue.channel = interaction.channel as MessageChannel;

        /* connect to the vc. */
        await player.connect(vc.id);
        return interaction.reply({
            ephemeral: true,
            embeds: [ new MessageEmbed()
                .setColor(PRIMARY_COLOR)
                .setDescription(`Joined **${vc}**`) ]
        });
    }
}