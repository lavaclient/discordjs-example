# discord.js v13 example bot

This is an example of lavaclient using discord.js v13

## Setup

- 1. Create an application in the [Discord Developer Portal](https://discord.com/developers/applications).
- 2. Grab the bot token from the "Bot" tab.
- 3. Click the `Use this template` button
- 4. Install all dependencies: `yarn` or `npm install`
- 5. Setup lavalink
    - 1. Make sure you have java 11 or above installed.
    - 2. Grab a jar from the [Lavalink Releases Page](https://github.com/freyacodes/lavalink/releases)
    - 3. Create an [application.yml](https://github.com/freyacodes/lavalink/blob/master/LavalinkServer/application.yml.example) in the same folder as the Lavalink.jar
    - 4. Start lavalink using: `java -jar Lavalink.jar`
- 6. Rename `.env.example` to `.env` and replace the value of `BOT_TOKEN` to the token from step 2
- 7. Run the Bot
    - production: `yarn start`
    - development: `yarn dev` or `yarn dev --force-sync` if you're modifying **application commands** (updating, creating, deleting, etc...)

