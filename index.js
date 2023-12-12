const TelegtamApi = require('node-telegram-bot-api');
const request = require('request');
const token = '6891044114:AAHi33ONqEEFaJkArrq4IuamPccLkSLQB7g';
const openWeatherMapApiKey = '9fde3782f36dea3a1936e0b7cebe7c90'
const bot = new TelegtamApi(token, {polling: true});

const botSayHi = "Здравствуйте, я Weathertestbot. Я могу подсказать вам погоду в любом городе мира(принимается название города ТОЛЬКО на английском языке!)";

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начать'},
    ])

    bot.on('/start', (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if(text === '/start'){
            bot.sendMessage(chatId, botSayHi)
        }
    });
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        getCurrentWeather(text, messageText => {
            bot.sendMessage(chatId, messageText)
        });
    });

    function getCurrentWeather(cityName, callback){
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${openWeatherMapApiKey}`;
        console.log(url)
        request(url, function (error, response, body) {
            if(error){
                return error
            }
            let info = JSON.parse(body)
            let weatherType = info.weather[0].id;
            let temp = info.main.temp;
            
            let emojiIcon = '';
            console.log(info)
            if(weatherType >= 200 && weatherType <= 232){
                emojiIcon = 'Гроза, ';
            }
            if(weatherType >= 300 && weatherType <= 321){
                emojiIcon = 'Морось, ';
            }
            if(weatherType >= 500 && weatherType <= 531){
                emojiIcon = 'Дождь, ';
            }
            if(weatherType >= 600 && weatherType <= 622){
                emojiIcon = 'Снег, ';
            }
            if(weatherType >= 701 && weatherType <= 781){
                emojiIcon = 'Туманно, ';
            }
            if(weatherType == 800 ){
                emojiIcon = 'Ясно, ';
            } if(weatherType >= 801 && weatherType <= 804){
                emojiIcon = 'Облачно, ';
            }
            
            text = `Погода в ${cityName}: ${emojiIcon} ${temp} градусов`;
            callback(text);
        });
   }
}
console.log(start())