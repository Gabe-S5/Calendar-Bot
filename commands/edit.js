const Discord = require('discord.js')
const { newEmbed } = require('./calendar.js')

function edit(message, editCategory) {
    const prompts = [
        `What would you like your ${editCategory} to be?`
    ]
    let counter = 0

    const filter = m => m.author.id === message.author.id

    const collector = new Discord.MessageCollector(message.channel, filter, {
        max: prompts.length,
        time: 1000 * 20
    })

    message.channel.send(prompts[counter++])
    collector.on('collect', m => {
        if (counter < prompts.length) {
            m.channel.send(prompts[counter++])
        }
    })

    collector.on('end', collected => {
        console.log(`Collected ${collected.size} messages`)

        if (collected.size < prompts.length) {
            message.reply('You did not reply in time.')
            return
        }
        let counter = 0
        collected.forEach((value) => {
            console.log(prompts[counter], value.content)
            if (editCategory === 'title') {
                newEmbed.title = value.content
            }
            else if (editCategory === 'description') {
                newEmbed.description = value.content
            }
            else if (editCategory === 'footer') {
                newEmbed.footer = { 
                    text: value.content,
                    iconURL: 'https://assets.stickpng.com/images/5ae6cd086554160a79be9f44.png'
                }
            }
            counter++
        })
        clearPrevious(message, 3)
        message.channel.send(newEmbed)
    })
}

function editEvent(message) {
    const prompts = [
        'Which date would you like to modify? ',
        'Input text you would like to write: '
    ]
    let counter = 0

    const filter = m => m.author.id === message.author.id
    
    const collector = new Discord.MessageCollector(message.channel, filter, {
        max: prompts.length,
        time: 1000 * 15
    })

    message.channel.send(prompts[counter++])
    collector.on('collect', m => {
        if (counter < prompts.length) {
            m.channel.send(prompts[counter++])
        }
    })

    collector.on('end', collected => {
        console.log(`Collected ${collected.size} messages`)

        if (collected.size < prompts.length) {
            message.reply('You did not reply in time. ')
            return
        }
        let counter = 0
        let match = false
        let matchDate = '', newEvent = ''
        collected.forEach((value) => {
            console.log(prompts[counter], value.content)
            for (let field of newEmbed.fields) {
                if (field.name.split(', ')[0].toLowerCase() === value.content.toLowerCase()) {
                    match = true
                    break
                }
            }               
            if (match) {
                if (counter === 0) matchDate = value.content
                else newEvent = value.content
            }
            counter++
        })
        if (match) {
            for (field of newEmbed.fields) {
                if (field.name.split(', ')[0].toLowerCase() === matchDate.toLowerCase()) {
                    field.value = newEvent
                    break
                }
            }
            clearPrevious(message, 5)
            message.channel.send(newEmbed)
        }
    })
}

function clearPrevious(message, amount) {
    message.channel.messages.fetch({ limit: amount }).then(messages => {
        message.channel.bulkDelete(messages, true);
    })
}

module.exports = {
    name: 'edit',
    description: 'Edit the calendar. Edit description, edit event, edit title.',
    execute(message, args) {
        const param = args[0].toLowerCase()
        if (!args[0]) {
            message.channel.send('Please indicate what you would like to edit. (title, description, event)')
        }
        else if (!newEmbed) {
            message.channel.send('No calendar currently made. ')
        }
        else if (param === 'title' || param === 'description' || param === 'footer') {
            edit(message, param)
        }
        else if (param === 'event') {
            editEvent(message)
        }
        else {
            message.channel.send('Paramater does not match. (description, title, event, footer)')
        }
    }
}

