import type { ApplicationCommand, ApplicationCommandData } from "discord.js";
import type { CommandContext } from "./CommandContext";
import type { Class } from "type-fest";

export function command(data: ApplicationCommandData) {
    return (target: Class<Command>) => {
        return class extends target {
            constructor(...args: any[]) {
                super(data, ...args);
            }
        }
    }
}

export class Command {
    readonly data: ApplicationCommandData;

    ref!: ApplicationCommand;

    constructor(data: ApplicationCommandData) {
        this.data = data;
    }

    exec(ctx: CommandContext, options?: Record<string, any>): any {
        void [ctx, options];
    };
}