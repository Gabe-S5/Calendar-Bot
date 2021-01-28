const Discord = require("discord.js");
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
    var modelEmbed = new Discord.MessageEmbed()
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

module.exports = {
    name: 'calendar',
    description: 'Shows your current calendar. Create new calendar with !calendar new.  ',
    execute(message, args) {
        if (!args[0]) {
            message.channel.send('Please indicate whether you would like to view the current calendar, add from the calendar or make a new calendar. (view, add, new) ')
        }
        else if (args[0] === 'view') {
            message.channel.send(newEmbed)
        }
        else if (args[0] === 'event') {
            addEvent(message)
        }
        else if (args[0] === 'description') {
            addDescription(message)
        }
        else if(args[0] === 'new') {
            const newEmbed = new Discord.MessageEmbed(createEmbed())
            message.channel.send(newEmbed)
        }
        else {
            message.channel.send(newEmbed)
        }
    },
    newEmbed
}
