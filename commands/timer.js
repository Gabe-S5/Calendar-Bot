
module.exports = {
    name: 'timer',
    description: 'Create an adjustable schedule for the week',
    execute(message, args) {
        if (!args[0]) { message.channel.send("Please indicate how many minutes you would like to set the timer. "); }
        if (args.length > 1) { message.channel.send("Too many parameters found. ")}
        if (args[0] > 144) { message.channel.send("Can only use timer for up to 24 hours long. ")}
        
        message.channel.send(`Preparing timer for ${args[0]} minutes! `)
        setTimeout(() => {
            message.channel.send(`${message.author.toString()} Your timer is up! `)
        }, args[0] * 60000)
    }
}