const { Guild } = require("discord.js");
const { Bot } = require("../Structures/Client");

/**
 * @param { Bot } client
 * @param { Guild } _guild
 * @returns { Array }
 */

async function getMessagesArray(client, _guild) {
  let Messages = await client.User.find({ guild: _guild.id })
    .sort([["messages", "Descending"]])
    .exec();

  let array = [];

  for (let i = 0; i < Messages.length; i++) {
    if (array.length >= 10) break;

    let user = _guild.members.cache.get(Messages[i].user);

    if (user) {
      array.push({
        User: user.toString(),
        Messages: Messages[i].messages,
      });
    }
  }

  return array;
}

module.exports = getMessagesArray;
