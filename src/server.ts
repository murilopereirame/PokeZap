import Pokemon from './Pokemon';

const venom = require('venom-bot');

venom.create(
  "masterClient", (base64Qr: string, asciiQR: string) => {
    console.log(`\n${asciiQR}`);
  }, (statusFind:any) => {
    console.log(statusFind);
  },{
    headless: true, // Headless chrome
    devtools: false, // Open devtools by default
    useChrome: false, // If false will use Chromium instance
    debug: false, // Opens a debug session
    logQR: true, // Logs QR automatically in terminal
    browserArgs: ['--disable-web-security','--no-sandbox'], // Parameters to be added into the chrome browser instance
    refreshQR: 15, // Will refresh QR every 15 seconds, 0 will load QR once. Default is 30 seconds
    autoClose: false, // Will auto close automatically if not synced, 'false' won't auto close. Default is 60 seconds (#Important!!! Will automatically set 'refreshQR' to 1000#)
    disableSpins: false, // Will disable Spinnies animation, useful for containers (docker) for a better log
  }
).then((client: any) => start(client));
 
function start(client: any) {
  client.onMessage((message: any) => {
    let messageBody: string = message.body;

    if(messageBody.includes('!pkn')) {
        let info = messageBody.split(' ');
        let index = undefined;
        let nome = undefined;
        
        isNaN(Number(info[1])) ? nome = info[1] : index = Number(info[1])

        let pokemon = new Pokemon(index, nome);
        pokemon.fetchData().then(() => {
            let info = pokemon.getInfo();
            let image = pokemon.getImg();
            client.sendImage(message.from, image, 'img.png', info);
            client.sendImageAsSticker(message.from, image);
        });
    }
    

  });
}