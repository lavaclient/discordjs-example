import "dotenv/config";
import "module-alias/register";
import { Utils, Bot, PRIMARY_COLOR } from "@lib";

const client = new Bot()

client.music.on("socketReady", ({ id }) => {
    console.log(`[music] now connected to lavalink node: "${id}"`)
});

client.music.on("queueFinished", queue => {
    queue.channel.send(Utils.embed({
        color: PRIMARY_COLOR,
        description: "Uh oh, the queue has ended :/"
    }));

    queue.player.disconnect();
})

client.music.on("trackStart", (queue, song) => {
    queue.channel.send(Utils.embed({
        color: PRIMARY_COLOR,
        description: `Now playing [**${song.title}**](${song.uri})${song.requester ? ` [<@${song.requester}>]` : ""}`,
        timestamp: Date.now()
    }));
});

client.on("ready", async () => {
    if (!process.argv.includes("--no-sync")) {
        await Utils.syncCommands(client);
    }

    client.music.init(client.user!.id); // Client#user shouldn't be null on ready
    console.log("[discord] ready!");
});

client.on("interactionCreate", interaction => {
    if (interaction.isCommand()) {
        const options = Object.assign({}, ...interaction.options.map(i => ({ [i.name]: i.value })));
        client.commands.get(interaction.commandId)?.exec(interaction, options);
    }
});

client.login(process.env.BOT_TOKEN)