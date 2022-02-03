// const chalk = require("chalk");
// const { Message, MessageEmbed } = require("discord.js");
// const { checkPermission } = require("../../Base/permission");
// const { Bot } = require("../../Structures/Client");

// module.exports = {
//   help: {
//     name: "help",


//     aliases: ["h"],

//     permissions: ["NO PERMISSIONS"],

//     required: ["ADMINISTRATOR"],

//     description: `\`help\` command provides help for using commands!`,

//     usage: [`{prefix}help <Command:Optional>`],

//     category: "others",
//   },

//   run: async (client, message, args) => {
//     try {
//       let clientPermission = await checkPermission("client", message, [
//         "ADMINISTRATOR",
//       ]);
//       if (clientPermission) return;

//       const { config } = client;

//       if (!args[0]) {
//         let Messages = [];
//         let Others = [];

//         //looping commands
//         client.commands.forEach((command) => {
//           if (command.help.category === "messages")
//             Messages.push(`**\`${command.help.name}\`**`);

//           if (command.help.category === "others")
//             Others.push(`**\`${command.help.name}\`**`);
//         });

//         return message.channel.send(
//           new MessageEmbed()
//             .setAuthor(
//               client.user.username + "'s help panel",
//               client.user.avatarURL({ dynamic: true })
//             )
//             .setFooter(
//               message.member.user.tag + ` | ${config.Embed.footer}`,
//               message.member.user.avatarURL({ dynamic: true })
//             )
//             .setColor(message.member.displayColor || config.Embed.Color)
//             .setDescription(
//               `Hey ${
//                 message.author.tag
//               },  ${
//                 (await client.users.fetch("601566168716935190")).tag
//               }. Automated Leadeboards included using >SetLB, and >Leaderboard to check them or >LB [here](${
//                 config.src
//               })`
//             )
//             .addField(`🧾 Messages`, Messages.join(" , "))
//             .addField(`🔍 Others`, Others.join(" , "))
//             .addField(
//               `Use \`${config.prefix}help <Command:Required>\` for more help about each command!`,
//               "** **"
//             )
//         );
//       }

//       let command =
//         (await client.commands.get(args[0])) ||
//         client.commands.get(client.aliases.get(args[0]));

//       if (!command)
//         return message.channel.send(
//           new MessageEmbed()
//             .setAuthor(
//               message.author.tag,
//               message.author.avatarURL({ dynamic: true })
//             )
//             .setColor(message.member.displayColor || config.Embed.Color)
//             .setTimestamp()
//             .setFooter(
//               config.Embed.footer,
//               client.user.avatarURL({ dynamic: true })
//             )
//             .setDescription(
//               `${config.Embed.Denied} **__|__ Unable to find \`${
//                 args[0] || "Unknown"
//               }\` command!**`
//             )
//         );

//       let usage = [];

//       command.help.usage.forEach((usages) => {
//         usage.push(usages.split("{prefix}").join(config.prefix));
//       });

//       message.channel.send(
//         new MessageEmbed()
//           .setAuthor(
//             message.author.tag,
//             message.author.avatarURL({ dynamic: true })
//           )
//           .setColor(message.member.displayColor || config.Embed.Color)
//           .setTimestamp()
//           .setFooter(
//             config.Embed.footer,
//             client.user.avatarURL({ dynamic: true })
//           )
//           .setDescription(`> **${command.help.description}**`)
//           .addField(`📚 Usage`, `\`${usage.join("` **,** `")}\``, true)
//           .addField(`📩 Category`, `\`${command.help.category}\``)
//           .addField(
//             `🚩 Shortcut(s)`,
//             `\`${command.help.aliases.join("` **,** `")}\``
//           )
//           .addField(
//             `💻 Permissions Required`,
//             `\`${command.help.permissions.join("` **,** `").toLowerCase()}\``
//           )
//       );
//     } catch (err) {
//       console.log(
//         chalk.redBright(
//           `${err.stack} | ${message.guild.name} (${message.channel.name})`
//         )
//       );
//     }
//   },
// };
