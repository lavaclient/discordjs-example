import { command, Command, PRIMARY_COLOR } from "@lib";
import { CommandInteraction, MessageEmbed } from "discord.js";

@command({ name: "ping", description: "Shows the latency of the bot." })
export default class Ping extends Command {
    exec(interaction: CommandInteraction) {
        interaction.reply({
            ephemeral: true,
            embeds: [ new MessageEmbed()
                .setColor(PRIMARY_COLOR)
                .setDescription(`Pong! **Heartbeat:** *${Math.round(interaction.client.ws.ping)}ms*`)]
        });
    }
}