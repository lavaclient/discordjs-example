import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import { lstatSync, readdirSync } from "fs";
import { join } from "path";

import type { Command } from "@lib";
import type { Bot } from "./Bot";
import type { NewsChannel, TextChannel, ThreadChannel } from "discord.js";

export type MessageChannel = TextChannel | ThreadChannel | NewsChannel;

export abstract class Utils {
    static PRIMARY_COLOR = 0xfff269;

    static embed(embed: MessageEmbedOptions | string): MessageEmbed {
        const options: MessageEmbedOptions = typeof embed === "string" ? { description: embed } : embed;
        options.color ??= Utils.PRIMARY_COLOR;

        return new MessageEmbed(options);
    }

    static walk(directory: string): string[] {
        function read(dir: string, files: string[] = []) {
            for (const item of readdirSync(dir)) {
                const path = join(dir, item), stat = lstatSync(path)
                if (stat.isDirectory()) {
                    files.concat(read(path, files))
                } else if (stat.isFile()) {
                    files.push(path);
                }
            }

            return files;
        }

        return read(directory);
    }

    static async syncCommands(client: Bot, dir: string, soft: boolean = false) {
        const commands: Command[] = [];
        for (const path of Utils.walk(dir)) {
            const { default: Command } = await import(path);
            if (!Command) {
                continue;
            }

            commands.push(new Command());
        }

        const commandManager = client.application!.commands,
            existing = await commandManager.fetch();

        /* do soft sync */
        if (soft) {
            for (const command of commands) {
                const ref = existing.find(c => c.name === command.data.name)
                if (!ref) {
                    continue
                }

                command.ref = ref;
                client.commands.set(ref.id, command);
            }

            console.log(`[discord] slash commands: registered ${client.commands.size}/${commands.length} commands.`);
            return;
        }

        /* get the slash commands to add, update, or remove. */
        const adding = commands.filter(c => existing.every(e => e.name !== c.data.name))
            , updating = commands.filter(c => existing.some(e => e.name === c.data.name))
            , removing = [ ...existing.filter(e => commands.every(c => c.data.name !== e.name)).values() ];

        console.log(`[discord] slash commands: removing ${removing.length}, adding ${adding.length}, updating ${updating.length}`)

        /* update/create slash commands. */
        const creating = [...adding, ...updating],
            created = await commandManager.set(creating.map(c => c.data));

        for (const command of creating) {
            command.ref = created.find(c => c.name === command.data.name)!;
            client.commands.set(command.ref.id, command);
        }
    }
}
