const chalk = require("chalk");
const { Message, MessageEmbed, MessageReaction } = require("discord.js");
const { checkPermission } = require("../../Base/permission");
const config = require("../../config");
const { Bot } = require("../../Structures/Client");

module.exports = {
  help: {
    //command name
    name: "leaderboard",

    //command aliases
    aliases: ["lb", "top"],

    //permissions required for user
    permissions: ["NO PERMISSIONS"],

    //permissions required for client
    required: ["SEND_MESSAGES", "EMBED_LINKS"],

    //command description
    description: `\`leaderboard\` command shows the messages leaderboard!`,

    //command usage example
    usage: [`{prefix}leaderboard <Page:Optional>`],

    //command category
    category: "messages",
  },
  /**
   *
   * @param { Bot } client
   * @param { Message } message
   * @param { String[] } args
   */
  run: async (client, message, args) => {
    try {
      //checking client permission
      let clientPermission = await checkPermission("client", message, [
        "ADMINISTRATOR",
      ]);
      if (clientPermission) return;

      //fetching Database
      let Database = await client.User.find({ guild: message.guild.id })

        //sorting data
        .sort([["messages", "Descending"]])
        .exec();

      //if database not found
      if (!Database || !Database.length)
        return message.channel.send(
          new MessageEmbed()
            .setAuthor(
              message.author.tag,
              message.author.avatarURL({ dynamic: true })
            )
            .setColor(message.member.displayColor || client.config.Embed.Color)
            .setFooter(
              client.config.Embed.footer,
              client.user.avatarURL({ dynamic: true })
            )
            .setDescription(
              `${client.config.Embed.Stuck} **No data to show leaderboard!**`
            )
        );

      //array
      let array = [];

      for (i = 0; i < Database.length; i++) {
        let user = message.guild.members.cache.get(Database[i].user);

        if (user) {
          array.push({
            User: user.toString(),
            Messages: Database[i].messages,
          });
        }
      }

      if (!array.length)
        return message.channel.send(
          new MessageEmbed()
            .setAuthor(
              message.author.tag,
              message.author.avatarURL({ dynamic: true })
            )
            .setColor(message.member.displayColor || client.config.Embed.Color)
            .setFooter(
              client.config.Embed.footer,
              client.user.avatarURL({ dynamic: true })
            )
            .setDescription(
              `${client.config.Embed.Stuck} **No data to show leaderboard!**`
            )
        );

      if (array.length <= 10) {
        let index = 1;

        return message.channel.send(
          new MessageEmbed()
            .setAuthor(
              message.guild.name + "'s messages leaderboard",
              message.guild.iconURL({ dynamic: true })
            )
            .setColor("BLACK")
            .setFooter(
              client.config.Embed.footer + " | Page: 1/1",
              client.user.avatarURL({ dynamic: true })
            )
            .setImage(
              `https://media.discordapp.net/attachments/612201812262649867/760335107394371624/divider1-1.gif`
             )
            .setDescription(
              array.map(
                (db) =>
                  `\`${index++}.\` ${db.User}・**${db.Messages}** messages`
              )
            )
        );
      }

      else if (array.length > 10) {
        const Leaderboard = await fetchLeaderboard(array);

        let Arr = [];

        let index = 1;

        for (Users of Leaderboard) {
          const description = Users.map(
            (db) => `\`${index++}.\` ${db.User}・**${db.Messages}** message(s)`
          );
          Arr.push(
            new MessageEmbed()
              .setAuthor(
                message.guild.name + "'s messages leaderboard",
                message.guild.iconURL({ dynamic: true })
              )
              .setFooter(
                client.config.Embed.footer,
                client.user.avatarURL({ dynamic: true })
              )
              .setColor(
                message.member.displayColor || client.config.Embed.Color
              )
              .setTimestamp()
              .setDescription(description)
              .setImage(
                `https://media.discordapp.net/attachments/612201812262649867/760335107394371624/divider1-1.gif`
              )
          );
        }

        if (!args[0] || isNaN(args[0])) return await Pages(message, Arr);

        if (args[0]) return await SendPage(message, Arr, args[0]);
      }
    } catch (err) {
      console.log(
        chalk.redBright(
          `${err.stack} | ${message.guild.name} (${message.channel.name})`
        )
      );
    }
  },
};

/**
 *
 * @param { Array } data
 * @returns { Array }
 */
async function fetchLeaderboard(data) {
  const result = [];

  for (let i = 0; i < data.length; i += 10) {
    result.push(data.slice(i, i + 10));
  }

  return result;
}

/**
 *
 * @param { Message } message
 * @param { Array } pages
 * @param { String } number
 */

async function SendPage(message, pages, number) {
  if (!message && !message.channel)
    throw new Error("Unable to access channel....");

  if (!Pages) throw new Error("Unable to access pages...");

  let embed = pages[parseInt(number - 1)];

  if (!embed)
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ dynamic: true })
        )
        .setFooter(
          message.client.config.Embed.footer,
          message.client.user.avatarURL({ dynamic: true })
        )
        .setColor(message.member.displayColor || client.config.Embed.Color)
        .setTimestamp()
        .setDescription(`${config.Embed.Stuck} | Page not found!`)
    ).then(msg=>msg.delete({timeout: 100000}));

  embed.setFooter(
    config.Embed.footer + ` | Page: ${number}/${pages.length}`,
    message.client.user.avatarURL({ dynamic: true })
  );

  message.channel.send(embed);
}


async function Pages(
  msg,
  pages,
  timeout = 120000,
  emojiList = ["⏮️", "◀️", "⏹️", "▶️", "⏭️"]
) {
  let page = 0;

  const current = await msg.channel.send(
    pages[page].setFooter(
      config.Embed.footer + ` | Page: ${page + 1}/${pages.length}`,
      msg.client.user.avatarURL({ dynamic: true })
    )
  );

  const reactionCollector = current.createReactionCollector(
    (reaction, user) =>
      emojiList.includes(reaction.emoji.name) && user.id === msg.author.id,
    { time: timeout }
  );

  for (const emoji of emojiList) await current.react(emoji);

  reactionCollector.on("collect", (reaction) => {
    reaction.users.remove(msg.author.id);

    switch (reaction.emoji.name) {
      case emojiList[0]:
        page = 0;
        break;
      case emojiList[1]:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case emojiList[2]:
        curPage.reactions.removeAll();
        break;
      case emojiList[3]:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      case emojiList[4]:
        page = pages.length - 1;
        break;
      default:
        break;
    }

    current.edit(
      pages[page].setFooter(
        config.Embed.footer + ` | Page: ${page + 1}/${pages.length}`,
        msg.client.user.avatarURL({ dynamic: true })
      )
    );
  });

  reactionCollector.on("end", () => {
    current.reactions.removeAll().catch(() => {});
  });
}
