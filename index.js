const Discord = require('discord.js')
const client = new Discord.Client()

const command = require('./command')
const config = require('./config.json')
const prefix = config.prefix
const token = process.env.TOKEN

const pm = require('./private-message')

client.on('ready', () => {
    console.log('The client is ready!')
    client.user.setActivity(`Help do -help`, { type: 'PLAYING' });

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
                .setDescription("Sorry, you can't use this commands")
                .setTimestamp()
            message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 1000 })
                })
            message.author.lastMessage.delete({ timeout: 1000 });
            return;
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
                { name: 'Staff', value: '`cc`, `clearchat`, `setstatus`, `kick`, `ban`'},
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
                { name: 'Speed Run Simulator', value: '```loadstring(game:HttpGet("https://raw.githubusercontent.com/Donut3339/myscriptxd/master/Speed%20Run%20Simulator.lua", true))()'},
                { name: 'King Piece', value: '```Soon```'},
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
                .setDescription("Sorry, you don't have permission to doing this commands.")
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
                .setDescription("Invalid args, please mention the user witch you want to kick.")
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
                .setDescription(":cry: i can't kick this user.")
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
                .setDescription("Sorry, you don't have permission to doing this commands.")
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
                .setDescription("Invalid args, please mention the user witch you want to ban.")
                .addField('Example:', '```-ban @Jexytd#3339 (time) (reason)```', true)
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
                .setDescription(":cry: i can't ban this user.")
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
    })

    command(client, ['lock', 'lockchannel'], (mesage) => {
        let {id} = message.guild.defaultRole, // get the ID of defaultRole
        ow = message.channel.permissionOverwrites.get(id); // get the permissionOverwrites fro that role

        // If the overwrites exist and SEND_MESSAGES is set to false, then it's already locked
        if (ow && ow.SEND_MESSAGES === false) message.channel.send("The channel is already locked.");
        else { // otherwise, lock it
            await message.channel.overwritePermissions(message.guild.defaultRole, { SEND_MESSAGES: false }, );
            return message.channel.send(`:lock: The channel is now locked..\nUse \`k!unlock\` to end lockdown.. `);
        }
    })
})

client.on('message', message => {
    if (!message.guild) return;
})

client.login(token)