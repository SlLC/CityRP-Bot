const chalk = require("chalk");
const { Message, MessageEmbed } = require("discord.js");
const getMessagesArray = require("../../Base/leaderboard");
const { checkPermission } = require("../../Base/permission");
const { Bot } = require("../../Structures/Client");

module.exports = {
  help: {
    name: "setleaderboard",

    aliases: ["setlb"],

    permissions: ["ADMINISTRATOR"],

    required: ["ADMINISTRATOR"],

    description: `\`setleaderboard\` command sets the automated leaderboard!`,

    usage: [`{prefix}setleaderboard <Channel:Optional>`],

    category: "messages",
  },

  run: async (client, message, args) => {
    try {
      let clientPermission = await checkPermission("client", message, [
        "ADMINISTRATOR",
      ]);
      if (clientPermission) return;

      let memberPermission = await checkPermission("member", message, [
        "ADMINISTRATOR",
      ]);
      if (memberPermission) return;

      let channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]) ||
        message.channel;

      let Leaderboard = await getMessagesArray(client, message.guild);

      let index = 1;

      const embed = new MessageEmbed()
        .setAuthor(
          message.guild.name + "'s messages leaderboard",
          message.guild.iconURL({ dynamic: true })
        )
        .setColor("BLACK")
        .setFooter(
          "・Next refresh Is In 5 Minutes",
          client.user.avatarURL({ dynamic: true })
        )
        .setTimestamp(Date.now() + client.config.Leaderboard.interval)
        .setImage(
          `https://media.discordapp.net/attachments/612201812262649867/760335107394371624/divider1-1.gif`
          )
        .setDescription(
          Leaderboard.map(
            (key) =>
              `${client.config.Embed.Arrow} \`${index++}\` ${key.User}・**${
                key.Messages
              }** messages`
          )
        );

      let Database = await client.Guild.findById(message.guild.id);

      let lastMessage = await channel.send(embed);

      if (!Database) {
        let doc = new client.Guild({
          _id: message.guild.id,
          Loggers: {
            Leaderboard: {
              LastMessage: lastMessage.id,
              Channel: channel.id,
            },
          },
        });
        await doc.save();
        return message.channel.send(
          new MessageEmbed()
            .setAuthor(
              message.author.tag,
              message.author.avatarURL({ dynamic: true })
            )
            .setColor(client.config.Embed.Color)
            .setFooter(
              client.config.Embed.footer,
              client.user.avatarURL({ dynamic: true })
            )
            .setTimestamp()
            .setDescription(
              `${
                client.config.Embed.Succes
              } | **New automated leaderboard channel : ${channel.toString()}**`
            )
        );
      } else {
        if (
          !Database.Loggers.Leaderboard.LastMessage &&
          !Database.Loggers.Leaderboard.Channel
        ) {

          Database.Loggers.Leaderboard.LastMessage = lastMessage.id;
          Database.Loggers.Leaderboard.Channel = channel.id;
          await Database.save();
          return message.channel.send(
            new MessageEmbed()
              .setAuthor(
                message.author.tag,
                message.author.avatarURL({ dynamic: true })
              )
              .setColor(client.config.Embed.Color)
              .setFooter(
                client.config.Embed.footer,
                client.user.avatarURL({ dynamic: true })
              )
              .setTimestamp()
              .setDescription(
                `${
                  client.config.Embed.Succes
                } | **New automated leaderboard channel : ${channel.toString()}**`
              )
          );
        }

        let OldChannel = message.guild.channels.cache.get(
          Database.Loggers.Leaderboard.Channel
        );
        if (OldChannel) {
          let OldMessage = await client.findMessage(
            Database.Loggers.Leaderboard.LastMessage,
            OldChannel
          );
          if (OldMessage) await OldMessage.delete().catch(() => {});
        }
        Database.Loggers.Leaderboard.LastMessage = lastMessage.id;
        Database.Loggers.Leaderboard.Channel = channel.id;
        await Database.save();

        return message.channel.send(
          new MessageEmbed()
            .setAuthor(
              message.author.tag,
              message.author.avatarURL({ dynamic: true })
            )
            .setColor(client.config.Embed.Color)
            .setFooter(
              client.config.Embed.footer,
              client.user.avatarURL({ dynamic: true })
            )
            .setTimestamp()
            .setDescription(
              `${
                client.config.Embed.Succes
              } | **New automated leaderboard channel : ${channel.toString()}**`
            )
        );
      }
    } catch (err) {
      console.log(
        chalk.redBright(
          `${err.message} | ${message.guild.name} (${message.channel.name})`
        )
      );
    }
  },
};
