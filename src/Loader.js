const chalk = require("chalk");
const fs = require("fs");
const { Bot } = require("./Structures/Client");

/**
 *
 * @param { Bot } client
 */
async function loadCommands(client) {
  //folders
  let folders = await fs.readdirSync(`${__dirname}/Commands`);


  folders.forEach((folder) => {

    fs.readdir(`${__dirname}/Commands/${folder}`, (err, files) => {

      if (err)
        return console.log(
          chalk.redBright(
            `An Error Occured While Loading Commands. ${err.stack}`
          )
        );


      if (!files && !files.length)
        return console.log(
          chalk.yellowBright(
            `[WARN]: No Files Found In "${folder.toUpperCase()}" Dir`
          )
        );


      files.forEach((file) => {

        let props = require(`../src/Commands/${folder}/${file}`);


        console.log(chalk.greenBright(`[LOADED]: ${file}`));



        if (!props.help || !props.help.name)
          return console.log(
            chalk.redBright(`[WARN]: ${file} not have enough help properties`)
          );


        client.commands.set(props.help.name, props);


        if (!props.help.aliases)
          return console.log(
            chalk.redBright(`[WARN]: ${file} not have enough aliases!`)
          );


        for (i = 0; i < props.help.aliases.length; i++) {
          client.aliases.set(props.help.aliases[i], props.help.name);
        }
      });
    });
  });
}

async function loadEvents(client) {

  fs.readdir(`${__dirname}/Events`, async (err, files) => {

    if (err)
      return console.log(
        chalk.redBright(`An Error Occured While Loading Events. ${err.stack}`)
      );

 
    if (!files)
      return console.log(
        chalk.redBright(`[WARN]: Events folder not have any files!`)
      );


    for (i = 0; i < files.length; i++) {

      const event = require(`../src/Events/${files[i]}`);


      let eventName = files[i].split(".")[0];


      client.on(eventName, event.bind(null, client));


      console.log(chalk.greenBright(`[LOADED]: ${files[i]}`));
    }
  });
}

module.exports = {
  loadCommands,
  loadEvents,
};
