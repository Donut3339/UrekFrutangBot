const Discord = require('discord.js')
const client = new Discord.Client()

const command = require('./command')
const config = require('./config.json')
const prefix = config.prefix
const token = process.env.TOKEN

const pm = require('./private-message')

client.on('ready', () => {
    console.log('The client is ready!')

    command(client, 'getrole', (message) => {
        if (message.member.roles.cache.some(r => r.name === "staff")) {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription('Staff role already added.')
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 1000 })
                })
            message.author.lastMessage.delete({ timeout: 1000 });
        } else {
            message.member.roles.add(message.guild.roles.cache.find(r => r.name === "staff")).catch(console.error);
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription('Added role staff.')
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 1000 })
                })
            message.author.lastMessage.delete({ timeout: 1000 });
        }
    })

    command(client, ['cc', 'clearchat'], (message) => {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results)
            })
        }
    })

    command(client, 'setstatus', (message) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            const content = message.content.replace(`${prefix}setstatus `, '')
            client.user.setPresence({
                activity: {
                    name: content,
                    type: 0,
                },
            });
        }
    })

    command(client, ['help', 'command', 'commands'], (message) => {
        message.reply('Check your dms!')
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Commands')
            .addFields(
                { name: 'General', value: '`getrole`, `help`'},
                { name: 'Staff', value: '`cc / clearchat`, `setstatus`'},
            )
            .setTimestamp()
        message.author.send(helpEmbed);
        message.author.lastMessage.delete({ timeout: 1000 });
    })

    command(client, 'getscript', (message) => {
        message.reply('Check your dms!')
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
        const scriptEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .addFields(
                { name: 'Speed Run Simulator', value: '```loadstring(game:HttpGet("https://raw.githubusercontent.com/Donut3339/myscriptxd/master/Speed%20Run%20Simulator.lua", true))()```'},
                { name: 'King Piece', value: '```Soon```'},
            )
            .setTimestamp()
        message.author.send(scriptEmbed);
        message.author.lastMessage.delete({ timeout: 1000 });
    })
})

client.on('message', message => {
    if (!message.guild) return;
})

client.login(token)