const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');
const config = require('./config.json');
let queues = {}

global.Buffer = global.Buffer || require('buffer').Buffer;

function checkNull(element, value) {
    element = element != undefined ? element : value
    return element
}

function random(min, max) { // Random com range entre numeros
    if (min instanceof Array) return min[Math.round(Math.random() * (min.length - 1))];
    min = checkNull(min, 0)
    if (max === undefined && min > 0) return Math.random() * min
    return Math.random() * (max - min) + min
}

function writecfg() {
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

});

client.on('message', message => {
    if (message.guild == null) return

    let prefix = "."
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const guild = message.guild
    const channel = message.channel

    if (command === "embed") {
        message.delete().catch(err => console.log(`Erro ao deletar mensagem (embed)\n${err}`))
        if(args[0] == undefined) return null
        fs.readFile('./embeds.json', {
            encoding: "ascii"
        }, (err, data) => {
            if(err) return console.log(`Erro em readFile (embed)\n${err}`)

            let embeds = JSON.parse(data)

            let type = args[0].toLowerCase() == "prata" ? "prata" : "ouro"
            let embed = embeds[type]
            channel.send({embed}).catch(err => console.log(err))
        })
    }
});

client.on("error", (e) => console.error(e)); // Para o bot nao crashar / crashar sem nenhuma mensagem de erro
client.on("warn", (e) => console.warn(e));
// client.on("debug", (e) => console.info(e));

client.login(config.token);