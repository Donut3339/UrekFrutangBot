const Discord = require('discord.js')
const client = new Discord.Client()

const command = require('./command')
const config = require('./config.json')
const prefix = config.prefix
const token = process.env.TOKEN

client.on('ready', () => {
    console.log('The client is ready!')
    client.user.setActivity(`Help do -help`, { type: 'PLAYING' });

    /*
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
    })*/

    command(client, ['cc', 'clearchat'], (message) => {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results)
            })
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription("Sorry, you don't have permission to use this commands.")
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 1000 })
                })
            message.author.lastMessage.delete({ timeout: 1000 });
            return;
        }
    })

    command(client, 'setstatus', (message) => {
        if (message.member.hasPermission({checkAdmin: true, checkOwner: true})) {
            const content = message.content.replace(`${prefix}setstatus `, '')
            client.user.setPresence({
                activity: {
                    name: content,
                    type: 0,
                },
            });
            message.author.lastMessage.delete({ timeout: 1000 });
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription("Sorry, you don't have permission to use this commands.")
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 1000 })
                })
            message.author.lastMessage.delete({ timeout: 1000 });
            return;
        }
    })

    command(client, 'help', (message) => {
        message.reply('Check your dms!')
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Commands')
            .addFields(
                { name: 'General', value: '`help`'},
                { name: 'Staff', value: '`cc`, `clearchat`, `setstatus`, `kick`, `ban`'},
            )
            .setTimestamp()
        message.author.send(helpEmbed);
        message.author.lastMessage.delete({ timeout: 1000 });
    })

    command(client, ['getscript', 'getscripts'], (message) => {
        message.reply('Check your dms!')
            .then(msg => {
                msg.delete({ timeout: 10000 })
            })
        const scriptEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .addFields(
                { name: 'Speed Run Simulator', value: '```lua\nloadstring(game:HttpGet("https://raw.githubusercontent.com/Donut3339/myscriptxd/master/Speed%20Run%20Simulator.lua", true))()```'},
                { name: 'King Piece', value: '```lua\nloadstring(game:HttpGet("https://raw.githubusercontent.com/Donut3339/myscriptxd/master/King%20Piece.lua", true))()```'},
                { name: 'A Universal Time', value: '```lua\nloadstring(game:HttpGet("https://raw.githubusercontent.com/Donut3339/myscriptxd/master/A%20Universal%20Time.lua", true))()```'},
                { name: 'One Punch Man: Destiny', value: '```lua\nshared.key = "free" -- if not working maybe the site down\nloadstring(game:HttpGet("https://raw.githubusercontent.com/Donut3339/myscriptxd/master/OPM_Destiny.lua", true))()```'}
            )
            .setTimestamp()
        message.author.send(scriptEmbed);
        message.author.lastMessage.delete({ timeout: 1000 });
    })

    command(client, 'kick', (message) => {
        if(!message.member.hasPermission('KICK_MEMBERS')) {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription("Sorry, you don't have permission to use this commands.")
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 1000 })
                })
            message.author.lastMessage.delete({ timeout: 1000 });
            return;
        };

        let mentionMember = message.mentions.members.first();
        if(!mentionMember) {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription("Invalid args, you need to provide a valid user to kick.")
                .addField('Example:', '```-kick @Jexytd#3339 (reason)```', true)
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            message.author.lastMessage.delete({ timeout: 10000 });
            return;
        }

        //Get the highest role of user for compare
        let authorHighestRole = message.member.roles.highest.position;
        let mentionHighestRole = mentionMember.roles.highest.position;

        if(mentionHighestRole >= authorHighestRole) {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription("Sorry, you can't kick members with an equal or higher position")
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            message.author.lastMessage.delete({ timeout: 10000 });
            return;
        };

        if(!mentionMember.kickable) {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription(":cry: User too strong. i can't kick him")
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            message.author.lastMessage.delete({ timeout: 10000 });
            return
        };

        let reason = message.content.split(" ").slice(2).join(' ');

        if (!reason) reason = (`No reason provided.`);

        const kickEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setAuthor(message.author.tag, message.author.avatarURL().toString())
            .addField(`Kick by ${message.author.tag}`, `:wave: You get kick from **${message.guild.name}** with **Reason:** ${reason}`)
            .setTimestamp()
            mentionMember.kick().then(m => {
                message.channel.send(kickEmbed)
                    .then(msg => {
                        msg.delete({ timeout: 10000 })
                    })
                message.author.lastMessage.delete({ timeout: 10000 });
            })

        mentionMember.kick()
            .catch(console.error);
    })

    command(client, 'ban', (message) => {
        if(!message.member.hasPermission('KICK_MEMBERS')) {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription("Sorry, you don't have permission to use this commands.")
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            message.author.lastMessage.delete({ timeout: 10000 });
            return;
        };

        let mentionMember = message.mentions.members.first();
        if(!mentionMember) {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription("Invalid args, you need to provide a valid user to kick.")
                .addField('Example:', '```-ban @Jexytd#3339 (reason)```', true)
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            message.author.lastMessage.delete({ timeout: 10000 });
            return;
        }

        //Get the highest role of user for compare
        let authorHighestRole = message.member.roles.highest.position;
        let mentionHighestRole = mentionMember.roles.highest.position;

        if(mentionHighestRole >= authorHighestRole) {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription("Sorry, you can't ban members with an equal or higher position")
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            message.author.lastMessage.delete({ timeout: 10000 });
            return;
        };

        if(!mentionMember.bannable) {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setAuthor(message.author.tag, message.author.avatarURL().toString())
                .setDescription(":cry: User too strong. i can't ban him")
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 10000 })
                })
            message.author.lastMessage.delete({ timeout: 10000 });
            return
        };

        mentionMember.ban(raeson)
            .catch(console.error);
    }
})

client.on('message', message => {
    if (!message.guild) return;
})

client.login(token)