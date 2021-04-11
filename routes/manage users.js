var express = require('express');
var router = express.Router();
const db = require('../model')('users');


router.post("/add",async (req,res) => {
	let user = [];	
	user[0] = req.body.newUser.userName;
	user[1] = req.body.newUser.password;
	user[2] = req.body.role.toLowerCase();
	console.log(user);
	await db.CREATE(user);
	
	res.send(200);
});

router.post("/update/:user",async (req,res) => {
	let body = req.body;
	await db.updateOne({userName: body.username},{role:body.role});
	
		res.send(200);
		res.end;		
	
});

router.post("/deleteUser/:user",async (req,res) =>{	
	if (await roleByName(req.params.user) == "manager") {
		await db.findOneAndDelete({userName:req.body.username}).then(() => console.log("delete"));
	}
	res.send(200);
	res.end;
});
router.get("/manageUsers/:user",async (req,res) =>{
	let name = req.params.user;
	console.log(name);
	let user = await db.find({userName: name});
	let isManager = (user[0].role == "manager");
	if (user != "") {
		managers = await db.find({role:"manager"});
		customers = await db.find({role:"customer"});
		employees = await db.find({role:"employee"});	
		res.render("manage_users.ejs",{managers,customers,employees,isManager});
		res.end;
	}
	res.send(400);	
})
module.exports = router;
async function roleByName(name) {
	let user = await db.find({userName : name}).exec();
	return user[0].role;
}
