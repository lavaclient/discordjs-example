import {  MessageEmbed } from "discord.js";

export class CommandContext {
    constructor(interaction) {
        this.interaction = interaction;
    }

    get client() {
        return this.interaction.client;
    }

    get player() {
        return (this.guild && this.client.music.players.get(this.guild.id)) ?? null;
    }

    get guild() {
        return this.interaction.guild;
    }

    get user() {
        return this.interaction.user;
    }

    get channel() {
        return this.interaction.channel;
    }

    reply(content, options = {}) {
        if (typeof content === "string" || content instanceof MessageEmbed) {
            return this.interaction.reply({
                [typeof content === "string" ? "content" : "embeds"]: typeof content === "string"
                    ? content
                    : [content],
                ...options
            });
        }

        return this.interaction.reply(content);
    }
}
