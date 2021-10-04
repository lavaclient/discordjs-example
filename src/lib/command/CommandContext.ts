import { Guild, Message, MessageEmbed } from "discord.js";
import type { Client, CommandInteraction, InteractionReplyOptions, User } from "discord.js";
import type { APIMessage } from "discord-api-types";
import { Player } from "lavaclient";
import type { MessageChannel } from "../index";

export class CommandContext {
    readonly interaction: CommandInteraction;

    constructor(interaction: CommandInteraction) {
        this.interaction = interaction;
    }

    get client(): Client {
        return this.interaction.client;
    }

    get player(): Player | null {
        return (this.guild && this.client.music.players.get(this.guild.id)) ?? null;
    }

    get guild(): Guild | null {
        return this.interaction.guild;
    }

    get user(): User {
        return this.interaction.user;
    }

    get channel(): MessageChannel {
        return this.interaction.channel as MessageChannel;
    }

    /* overloads: not fetching the reply */
    reply(content: MessageEmbed, options?: Omit<InteractionReplyOptions, "embeds">): Promise<void>
    reply(content: string, options?: Omit<InteractionReplyOptions, "content">): Promise<void>
    reply(options: InteractionReplyOptions): Promise<void>

    /* overloads: fetch reply */
    reply(content: MessageEmbed, options?: Omit<InteractionReplyOptions, "embeds"> & { fetchReply: true }): Promise<Message | APIMessage>
    reply(content: string, options?: Omit<InteractionReplyOptions, "content"> & { fetchReply: true }): Promise<Message | APIMessage>
    reply(options: InteractionReplyOptions & { fetchReply: true }): Promise<Message | APIMessage>;

    /* actual method */
    reply(content: string | MessageEmbed | InteractionReplyOptions, options: InteractionReplyOptions = {}): Promise<any> {
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
