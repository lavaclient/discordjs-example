import { Queue as BaseQueue } from "@lavaclient/queue";
import type { NewsChannel, TextChannel, ThreadChannel } from "discord.js";

export class Queue extends BaseQueue {
    channel!: MessageChannel;
}

export type MessageChannel = TextChannel | ThreadChannel | NewsChannel

declare module "@lavaclient/queue" {
    interface Queue {
        channel: MessageChannel;
    }
}
