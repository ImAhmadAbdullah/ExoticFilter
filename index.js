const Discord = require("discord.js");
const client = new Discord.Client();
var randomstring = require("randomstring");
require("dotenv").config();
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const prefix = "$";
const moderatedChars = 12;
const nicknameBannedRole = "Nickname Banned";

client.on("message", async message => {
  if (message.content === `${prefix}resetnicknames`) {
    message.guild.members.cache.forEach(member => {
      const nickname = member.nickname;
      if (nickname && !nickname.toLowerCase().startsWith("moderated")) {
        member
          .setNickname(null)
          .then(() => console.log(`Reset nickname for ${member.user.tag}`))
          .then(() => message.channel.send(`Reset nickname for ${member.user.tag}`))
          .catch(console.error);
      }
    });
  }
  if (message.content === `${prefix}dehoist`) {
    const members = Array.from(message.guild.members.cache);
    for (const member of members) {
      const nickname = member.displayName;
      const alphanumericCount = (nickname.match(/[a-zA-Z0-9]/g) || []).length;
      if (nickname[0].match(/^[^a-zA-Z0-9]/) && alphanumericCount >= 2) {
        const newNickname = `Moderated Nickname ${randomstring.generate(moderatedChars)}`;
        member
          .setNickname(newNickname)
          .then(() => console.log(`Changed nickname for ${member.user.tag} to ${newNickname}`))
          .then(() =>
            message.channel.send(`Changed nickname for ${member.user.tag} to ${newNickname}`)
          )
          .catch(console.error);
      } else if (nickname.match(/^[-!*_.]/) && nickname.length > 1) {
        const newNickname = nickname.replace(/^[-!*_.]+/, "");
        member
          .setNickname(newNickname)
          .then(() => console.log(`Changed nickname for ${member.user.tag} to ${newNickname}`))
          .then(() =>
            message.channel.send(`Changed nickname for ${member.user.tag} to ${newNickname}`)
          )
          .catch(console.error);
      }
    }
  }
  if (message.content.startsWith(`${prefix}moderate`)) {
    const role = message.guild.roles.cache.find(role => role.name === nicknameBannedRole);
    const nameToFind = message.content.split(" ")[1].toLowerCase();
    console.log(`Searching for name containing '${nameToFind}'...`);

    const usersFound = message.guild.members.cache.filter(user =>
      user.displayName.toLowerCase().includes(nameToFind)
    );
    usersFound.forEach(a => {
      a.setNickname(`Moderated Nickname ${randomstring.generate(12)}`);
      console.log(`Moderated ${a}`);
      a.roles
        .add(role)
        .then(() => {
          console.log(`Added role '${role}' to ${a.user.tag}`);
        })
        .catch(console.error);
    });
    console.log(`Number of users found with name containing '${nameToFind}': ${usersFound.size}`);
    if (usersFound.size > 0) {
      const usersFoundStr = [...usersFound.values()].map(user => user.displayName).join("\n");
      console.log(`Users found with name containing '${nameToFind}':\n${usersFoundStr}`);
      const response = `Users found with name containing '${nameToFind}':\n${usersFoundStr}`;
      await message.channel.send(response);
    } else {
      console.log(`No users found with name containing '${nameToFind}'`);
      const response = `No users found with name containing "${nameToFind}"`;
      await message.channel.send(response);
    }
  }
  if (message.content.startsWith(`${prefix}demoderate`)) {
    const role = message.guild.roles.cache.find(role => role.name === nicknameBannedRole);
    const nameToFind = message.content.split(" ")[1].toLowerCase();
    console.log(`Searching for name containing '${nameToFind}'...`);

    const usersFound = message.guild.members.cache.filter(user =>
      user.displayName.toLowerCase().includes(nameToFind)
    );
    usersFound.forEach(a => {
      a.setNickname(null);
      a.roles
        .remove(role)
        .then(() => {
          console.log(`Dehoised ${a.user.tag}`);
        })
        .catch(console.error);
    });

    console.log(`Number of users found with name containing '${nameToFind}': ${usersFound.size}`);

    if (usersFound.size > 0) {
      const usersFoundStr = [...usersFound.values()].map(user => user.displayName).join("\n");
      console.log(`Users found with name containing '${nameToFind}':\n${usersFoundStr}`);
      const response = `Users found with name containing '${nameToFind}':\n${usersFoundStr}`;
      await message.channel.send(response);
    } else {
      console.log(`No users found with name containing '${nameToFind}'`);
      const response = `No users found with name containing "${nameToFind}"`;
      await message.channel.send(response);
    }
  }
});

client.login(process.env.TOKEN);
