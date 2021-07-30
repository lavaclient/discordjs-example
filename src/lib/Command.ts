import type { ApplicationCommand, ApplicationCommandData, CommandInteraction } from "discord.js";
import type { Class } from "type-fest";

export function command(options: ApplicationCommandData) {
    return (target: Class<Command>) => {
        return class extends target {
            constructor (...args: any[]) {
                super(options, ...args);
            }
        }
    }
}

export class Command {
    readonly options: ApplicationCommandData;

    ref!: ApplicationCommand;

    constructor (options: ApplicationCommandData) {
        this.options = options;
    }

    exec(interaction: CommandInteraction, options?: Record<string, any>): any {
        void [interaction, options];
    };
}