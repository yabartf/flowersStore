const flowerDB = require('./model')('flowers');
//const timeout = require("./timeout");
const prompt = require('./prompt');

(async () => {
  console.clear();
 // await timeout(500);
  while (true) {
    let flower = [];
    console.log();
    flower[0] = await prompt("Please enter path: ");
    flower[1] = await prompt('Please enter desc: ');
    flower[2] = await prompt('Please enter color: ');
    flower[3] = await prompt('Please enter cost: ');    
    
    console.log(flower);
    try {
        //await User.save({});      
        await flowerDB.CREATE(flower);
        
        console.log('flower created: ' + flower);
    } catch(err) { throw err; }
  }
})();
