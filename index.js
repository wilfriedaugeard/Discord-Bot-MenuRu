 /**
     * index.js
     *
     * Discord Bot 
     *
     * @author     Willou <augeardw@gmail.com>
     * @copyright  2019 Willou
     * @version    1.0.0-beta
     */

const discord = require('discord.js');
const client = new discord.Client();

//API RU
var myjson = 'null';
require('http').get('http://waugeard.com/API_menu_ru', function(res)
{
	var buff= new Buffer(0);
	res.on('data', function(data){
		buff = Buffer.concat([buff,data], buff.length + data.length);
	});
	res.on('end', function(){
        myjson = buff.toString('utf8');
		
	});
	res.on('error', function(e){
		console.error(e);
	});
});

//get date
function dateFr()
{
    var mois = new Array("janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre");
    var date = new Date();
    
    var message = date.getDate() + " ";   // numero du jour
    message += mois[date.getMonth()] + " ";   // mois
    message += date.getFullYear();
    return message;
}


//Display menu of a date and chains 
function creer_menu(date, chaine){
    var myObj = JSON.parse(myjson);
    var message = myObj['date'][date]['Déjeuner'][chaine];
    if(message != "menu non communiqué" && message != "FERMÉE"){
        var entree =message['Entrée'];
        var plat = message['Plat'];
        var dessert = message['Dessert'];
        message = 
                        "**Entrée:** \n"+entree+"\n"+
                        "**Plat: **\n"+plat+"\n"+
                        "**Dessert:** \n"+dessert+"\n\n";
    }else{
        message = "**"+myObj['date'][date]['Déjeuner'][chaine]+"**\n\n";
    }
    return message;
}


//Display menu of the given day
function affiche_jour(date){
    var myObj = JSON.parse(myjson);
    var message = {embed: {
        color: 3447003,
        author: {
            name: "Menu du "+date,
            icon_url: "http://www.crous-bordeaux.fr/wp-content/uploads/sites/14/2015/10/Crous-logo-bordeaux-aquitaine-210x210.png"
        },
        fields: [
            {
                name: "**CHAINE TRADITIONNELLE**",
                value: creer_menu(date,'CHAINE TRADITIONNELLE'),
                inline: true
            },
            {
                name: "**TOURISTE**",
                value: creer_menu(date,'TOURISTE'),
                inline: true
            },
            {
                name: "**CHAINE FRITERIE**",
                value: creer_menu(date,'CHAINE FRITERIE'),
                inline: true
            },
            {
                name: "**POISSON**",
                value: creer_menu(date,'POISSON'),
                inline: true
            },
        ],
        timestamp: new Date(),
        }
    } 
    return message;
}

//Check the date
function availableDate(date){
    var myObj = JSON.parse(myjson);
    for (var d in myObj['date']){
        if(d == date){
            return true;
        }
    }return false;
}

//Display available days
function ShowavailableDate(){
    var myObj = JSON.parse(myjson);
    var message = "**Jours disponibles**\n\n"
    for (var d in myObj['date']){
           message += d+"\n";
    }
    return message;
}


//Display commands
function help(){
    var myObj = JSON.parse(myjson);
    var message = {embed: {
        color: 0xff0800,
        author: {
            name: "Bot Command"
        },
        fields: [
            {
                name: "**About Menu**",
                value: "**"+prefixe+"menu**    -    *Show today's menu.*\n**"+prefixe+"daysmenu**    -    *Show all available days.*\n**"+prefixe+"menuof *<date> <month> <year (optional)>***    -    *Show menu of the chosen day.*\n",
                inline: true
            },
            {
                name: "**Other**",
                value: "**"+prefixe+"date**    -    *Show today's date.*  \n"+prefixe+"**ping**    -    *Pong !*\n",
                inline: true
            }
        ],
        timestamp: new Date(),
        }
    }; 
    return message;
}





//BOT
client.on('ready', function(){
    console.log("Bot => OK")
    affiche_jour(dateFr());
})

//Message treatment
var prefixe = ".";
client.on('message', function(message){
    //Ping Pong
    if(message.content === prefixe+'ping'){
        message.channel.send('Pong !')
    }
    //Help
    if(message.content === prefixe+'help'){
       var help_message = help();
       message.channel.send(help_message)
    }
    //Date
    if(message.content === prefixe+'date'){
        message.channel.send(dateFr())
    }
    //Display menus of the current day
    if(message.content === prefixe+'menu'){
        var menu = affiche_jour(dateFr());
        message.channel.send(menu);
    }
    //Display menus of a chosen day
    if(message.content.startsWith(prefixe+"menuof")){
        //SPLIT COMMAND 
        const arg = message.content.slice(prefixe+"menuof").trim().split(/ +/g);

        //USAGE
        if(arg.length != 3 && arg.length != 4 ){
            var date = dateFr();
            var rediuceDate = date.split(' ');
            message.channel.send("**Usage**: \n*"+prefixe+"menuof "+rediuceDate[0]+" "+rediuceDate[1]+"*\n-----------\n*"+prefixe+"menuof "+date+"*");

        //CHECK DATE AND SHOW MENU
        }else{
            var date = new Date();
            if(arg.length == 4) date = arg[1]+" "+arg[2]+" "+arg[3];
            if(arg.length == 3) date = arg[1]+" "+arg[2]+" "+date.getFullYear();
            
            if(availableDate(date)){
                var menu = affiche_jour(date);
                message.channel.send(menu);
            }else{
                message.channel.send("Jour indisponible ou mal orthographié.\n*"+prefixe+"daysmenu* pour voir les jours disponibles.")
            }  
        }
    }
    //Display available dates
    if(message.content == prefixe+"daysmenu"){
        var days = ShowavailableDate();
        message.channel.send(days);
    }
})


client.login('YourTokenHere')

