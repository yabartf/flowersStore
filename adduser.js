const User = require('./model')('users');
//const timeout = require("./timeout");
const prompt = require('./prompt');

(async () => {
  console.clear();
 // await timeout(500);
  while (true) {
    let user = [];
    console.log();
    user[0] = await prompt("Please enter username: ");
    user[1] = await prompt('Please enter password: ');
    user[2] = await prompt('Please enter role: ');
   // let admin = await prompt('Please enter admin status (Y or anything other): ');
    
    console.log(user);
    try {
        //await User.save({});      
        await User.CREATE(user);
        
        console.log('User created:' + user);
    } catch(err) { throw err; }
  }
})();
