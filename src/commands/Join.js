import { Command, Utils } from "@lib";

export default class Join extends Command {
    constructor() {
        super({ name: "join", description: "Joins the member's voice channel." });
    }

    async exec(ctx) {
        /* check if the invoker is in a voice channel. */
        const vc = ctx.guild?.voiceStates?.cache?.get(ctx.user.id)?.channel;
        if (!vc) {
            return ctx.reply(Utils.embed("Join a vc bozo"), { ephemeral: true })
        }

        /* check if a player already exists for this guild. */
        const player = ctx.client.music.createPlayer(vc.guild.id);
        if (player.connected) {
            return ctx.reply(Utils.embed("I'm already connected to a vc."), { ephemeral: true });
        }

        /* set the queue channel. */
        player.queue.channel = ctx.channel;

        /* connect to the vc. */
        await player.connect(vc.id);

        return ctx.reply(Utils.embed(`Joined ${vc}`));
    }
}
