const chalk = require("chalk");
const { Message, MessageEmbed } = require("discord.js");
const { checkPermission } = require("../../Base/permission");
const { Bot } = require("../../Structures/Client");

module.exports = {
  help: {
    name: "changelog",

    aliases: ["chlog"],

    permissions: ["NO PERMISSIONS"],

    required: ["SEND_MESSAGES", "EMBED_LINKS"],

    description: `\`chlogs\` Shows you recent changelogs for CityRP `,

    usage: [`{prefix}changelog`],


    category: "messages",
  },

  run: async (client, message, args) => {
    let clientPermission = await checkPermission("client", message, [
        "ADMINISTRATOR",
      ]);
      if (clientPermission) return;

      if(message.content === '>changelog') {
          const embed = new MessageEmbed()
          .setTitle('This Is the full on title of the embed')
          .setDescription('Description of It will be here')
          .addFields(
              {
                  name: "This is a title for the field #1 for the changelog which can be edited / put Into emojis (🔥) ETC ETC",
                  value: "\u200B \n This Is a description for the title which can also be edited, used with * and all other variables.",
                  inline: true
              },
              {
                name: "The value (Space under the title) can also be left empty!",
                value: "ㅤ ㅤ ㅤ ㅤ ∎ You are also able to using gifs in this but that requires another thing i have to write. And this Is just basically rinse and repeat for the change log \n PLUS you are able to unallign them like this .",
                inline: false
            },
            {
              name: "\u200B",
              value: 
              "Test \n \ \ \ \  t",
              inline: false
          }, 
          )
          .setTimestamp()
          .setFooter('Change log released at : ')

          message.reply(embed)
      }
  }}

  /* ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ  < invisible characters*/