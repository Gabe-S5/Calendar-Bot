const Discord = require('discord.js')
const {prefix, token} = require('./.credentials/config.json');
const fs = require('fs')

const client = new Discord.Client();;
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
    client.user.setActivity('Calendar Bot', { type: 'WATCHING' })
    client.user.setPresence({ activity: { name: 'Your Schedule' }, status: 'online' })
});

client.on('message', message => {
    console.log(`[${message.author.tag}]: ${message.content}`);
    // Message must start with prefix and cannot be a bot message
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // args variable that only contains content after the command name
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // Show commands 
    if (message.content.startsWith(`${prefix}commands`)) {
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            message.channel.send(`${prefix}${command.name}: ${command.description}`);
        }
    }

    // Not an existing command return
    if (!client.commands.has(command)) return

    // Try each command.name in the commands folder and execute 
    try {
        client.commands.get(command).execute(message, args)
    } catch (error) {
        console.error(error)
        message.reply('There was an error while trying to execute that command.')
    }
});

client.login(token)