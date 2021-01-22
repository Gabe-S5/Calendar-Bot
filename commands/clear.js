module.exports = {
    name: 'clear',
    description: 'Deletes a set number of messages.',
    async execute(message, args) {
        const amount = args[0];
        if (!amount) return message.reply('Not an amount that could be deleted!');
        if (isNaN(amount)) return message.reply('Parameter is not a number!');

        if (amount > 100) return message.reply('You cannot delete more than 100 messages at once!');
        if (amount < 1) return message.reply('You have to delete at least 1 message! ');

        await message.channel.messages.fetch({ limit: amount }).then(messages => {
            message.channel.bulkDelete(messages, true);
            message.channel.send(`Deleted ${amount} messages.`)
        })
    }
}