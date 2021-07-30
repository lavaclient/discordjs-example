import "dotenv/config";
import "module-alias/register";
import { Utils, Bot, CommandContext } from "@lib";

const client = new Bot()

client.music.on("socketReady", ({ id }) => {
    console.log(`[music] now connected to lavalink node: "${id}"`)
});

client.music.on("queueFinished", queue => {
    const embed = Utils.embed("Uh oh, the queue has ended :/");
    
    queue.channel.send({ embeds: [ embed ] });
    queue.player.manager.destroy(queue.player.guild);
})

client.music.on("trackStart", (queue, song) => {
    const embed = Utils.embed(`Now playing [**${song.title}**](${song.uri})${song.requester ? ` [<@${song.requester}>]` : ""}`)
    queue.channel.send({ embeds: [embed] });
});

client.on("ready", async () => {
    await Utils.syncCommands(client, __dirname + "/commands", !process.argv.includes("--force-sync"));
    client.music.init(client.user!.id); // Client#user shouldn't be null on ready
    console.log("[discord] ready!");
});

client.on("interactionCreate", interaction => {
    if (interaction.isCommand()) {
        const options = Object.assign({}, ...interaction.options.map(i => ({ [i.name]: i.value })));
        client.commands.get(interaction.commandId)?.exec(new CommandContext(interaction), options);
    }
});

client.login(process.env.BOT_TOKEN)