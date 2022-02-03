const chalk = require("chalk");
const { Message, MessageEmbed } = require("discord.js");
const { checkPermission } = require("../../Base/permission");
const { Bot } = require("../../Structures/Client");

module.exports = {
  help: {
    name: "messages",

    aliases: ["message"],

    permissions: ["NO PERMISSIONS"],

    required: ["SEND_MESSAGES", "EMBED_LINKS"],

    description: `\`messages\` command shows how many messages you currently have!`,

    usage: [`{prefix}messages <user:Optional>`],


    category: "messages",
  },

  run: async (client, message, args) => {
    try {
      //checking client permission
      let clientPermission = await checkPermission("client", message, [
        "ADMINISTRATOR",
      ]);
      if (clientPermission) return;

      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.member;

      let Database = await client.User.findOne({
        guild: message.guild.id,
        user: member.id,
      });

      if (!Database || !Database.messages) {
        Database = {
          messages: 0,
        };
      } else {
        Database.messages = Database.messages;
      }

      let Leaderboard = await client.User.find({ guild: message.guild.id })
        .sort([["messages", "Descending"]])
        .exec();

      let Position = Leaderboard.findIndex(
        (Member) => Member.user === member.id
      );

      message.channel.send(
        new MessageEmbed()
          .setAuthor(
            message.author.tag,
            message.author.avatarURL({ dynamic: true })
          )
          .setFooter(
            client.config.Embed.footer,
            client.user.avatarURL({ dynamic: true })
          )
          .setDescription(`Showing information of ${member.user.tag}`)
          .addField(`✉ Messages`, `**${Database.messages}**`, true)
          .addField(`🎖 Position`, `**${Position + 1 || "Unknown"}**`, true)
          .setColor(message.member.displayColor || client.config.Embed.Color)
      );
    } catch (err) {
      console.log(
        chalk.redBright(
          `${err.stack} | ${message.guild.name} (${message.channel.name})`
        )
      );
    }
  },
};
