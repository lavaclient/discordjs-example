import { MessageEmbed, MessageEmbedOptions, MessageOptions } from "discord.js";
import { lstatSync, readdirSync } from "fs";
import { join } from "path";

import type { Command } from "@lib";
import type { Bot } from "./Bot";

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

    static async syncCommands(client: Bot, dir: string) {
        const commands: Command[] = [];
        for (const path of Utils.walk(dir)) {
            const { default: Command } = await import(path);
            if (!Command) {
                continue;
            }
        
            commands.push(new Command());
        }

        const commandManager = client.application!.commands
        const existing = await commandManager.fetch();

        /* get the slash commands to add, update, or remove. */
        const adding = commands.filter(c => existing.every(e => e.name !== c.options.name))
            , updating = commands.filter(c => existing.some(e => e.name === c.options.name))
            , removing = existing.filter(e => commands.every(c => c.options.name !== e.name)).array();

        console.log(`[discord] slash commands: removing ${removing.length}, adding ${adding.length}, updating ${updating.length}`)

        /* update/create slash commands. */
        const creating = [ ...adding, ...updating ],
            created = await commandManager.set(creating.map(c => c.options));

        for (const command of creating) {
            command.ref = created.find(c => c.name === command.options.name)!;
            client.commands.set(command.ref.id, command);
        }

        /* delete slash commands. */
        commandManager.fetch()
            .then(f => f.filter(e => removing.some(c => c.id === e.id)))
            .then(f => f.forEach(c => {
                console.log(`[discord] slash commands: deleting "${c.name}"`)
                c.delete()
            }));
    }
}