const Discord = require("discord.js");
const clear = require("./clear");

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var today = new Date();
var dd = today.getDate(), mm = monthNames[String(today.getMonth())], day = today.getDay(), yy = today.getFullYear();

function getDaysOfWeek(day) {
    const week = []
    for ( let i = day, j = 0; i < 7; i++) {
        week.push(`${dayNames[i]}, ${mm} ${dd + j}`)
        j++
    }
    for ( let i = day-1, j = 1; i > -1; i--) {
        week.unshift(`${dayNames[i]}, ${mm} ${dd - j}`)
        j++
    }
    return week;
}
function createEmbed() {
    const fullDates = getDaysOfWeek(day)
    const modelEmbed = new Discord.MessageEmbed()
    .setColor('#0000FF')
    .setTitle('My Calender for the Week! ')
    .setDescription('The following are my goals and tasks for the week. ')
    .setThumbnail('https://assets.stickpng.com/images/5ae6cd086554160a79be9f44.png')
    .addFields(
        {
            name: fullDates[0],
            value: `No tasks for today! `,
            inline: true
        },
        {
            name: fullDates[1],
            value: `No tasks for today! `,
            inline: true
        },
        {
            name: fullDates[2],
            value: `No tasks for today! `,
            inline: true
        },
        {
            name: fullDates[3],
            value: `No tasks for today! `,
            inline: true
        },
        {
            name: fullDates[4],
            value: `No tasks for today! `,
            inline: true
        },
        {
            name: fullDates[5],
            value: `No tasks for today! `,
            inline: true
        },
        {
            name: fullDates[6],
            value: `No tasks for today! `,
            inline: true
        }
    )
    .setTimestamp()
    .setFooter('Your weekly calendar! ', 'https://assets.stickpng.com/images/5ae6cd086554160a79be9f44.png')
    return modelEmbed
}

const newEmbed = new Discord.MessageEmbed(createEmbed())

function addEvent(message) {
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
    name: 'calendar',
    description: 'Shows current week with any events or notes that may have been added. ',
    execute(message, args) {
        if (!args[0]) {
            message.channel.send('Please indicate whether you would like to view the current calendar, add from the calendar or make a new calendar. (view, add, new) ')
        }
        else if (args[0] === 'view') {
            message.channel.send(newEmbed)
        }
        else if (args[0] === 'add') {
            addEvent(message)
        }
        else if(args[0] === 'new') {
            const newEmbed = new Discord.MessageEmbed(createEmbed())
            message.channel.send(newEmbed)
        }
    }
}
