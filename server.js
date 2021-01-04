let http = require("http");
let path = require("path");
var fs = require('fs');
let aboutPath = "about";
var users = require("./public/data/users.json");
const usersPath = "./public/data/users.json";
let branches = require("./public/data/branch.json")
let flowers = require("./public/data/flowers.json")
const { parse } = require('querystring');
//express server 
let express = require('express');
const { json } = require("express");
const { send } = require("process");
const { SSL_OP_EPHEMERAL_RSA } = require("constants");
let app = express();
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'ejs');


app.listen(8080,function(){
	console.log("express server runing at port 8080");

});
app.get('/',function(req,res){
	res.render('index');
	
});
async function timer(time) {
	await sleep(time);
}
app.post("/add", (req,res) =>{
	timer(1000);	
	req.on('data',user =>{	
		let temp;
		data = JSON.parse(user.toString());					
		temp = users[data.role.toLowerCase() + "s"];
		temp.push(data.newUser);
		fs.writeFile("./public/data/users.json",JSON.stringify(users),(err)=>{			
			console.log(err);
		});
	});
	res.send(200);
});

app.post("/update/:user", (req,res) => {
	let us = roleByName(req.params.user);
	req.on('data', details =>{
		data = JSON.parse(details.toString());				
		let rol = role(data);							
		if ((us == "employee" && rol == "customer") || us == "manager") {		
		let temp;		
		users[rol + "s"].forEach(element => {			
			if (element.userName == data.username) {				
				element.active = false;
				 temp = users[data.newrole + "s"];
			}
		});
		temp.push({"userName": data.username, "password":data.password,"active": true});						
		fs.writeFile("./public/data/users.json",JSON.stringify(users),(err)=>{			
			console.log(err);
		});
		res.send(200);		
	}
	else
	res.send(400);
	res.end;
	});
});

app.post("/deleteUser/:user",(req,res) =>{	
	if (roleByName(req.params.user) == "manager") {
	req.on('data', details =>{				
		data = JSON.parse(details.toString());				
		let rol = role(data);				
		users[rol + "s"].forEach(element => {			
			if (element.userName == data.username) {				
				element.active = false;				
			}
		});
		fs.writeFile("./public/data/users.json",JSON.stringify(users),(err)=>{			
			console.log(err);
		});
		res.send(200);
		res.end;
	});
	}
	res.end;
});

app.get("/manageUsers/:user",(req,res) =>{
	let rol = roleByName(req.params.user);	
	if (rol != "") {
	managers = users.managers;
	customers = users.customers;
	employees = users.employees;	
	let isManager = (rol == "manager");
	res.render("manage_users.ejs",{managers,customers,employees,isManager});
	}
	res.send(400);
});

app.get('/catalog/:user',(req,res) =>{
	let rol = roleByName(req.params.user);	
	flowersArr = flowers.images;
	if (rol != "")
		res.render("catalog.ejs",flowersArr);
	else
		res.send(400);
	res.end;
	//res.render("about.ejs");	
});

app.get('/about',(req, res) =>  {
	res.render("about.ejs",{role : role});		
});

app.get('/contact',(req, res) =>  {
	res.render("contact.ejs");		
});

app.get('/role/:username',(req, res) =>  {
	res.end(roleByName(req.params["username"]));		
});

app.get('/Manage_branches/:user',(req,res) =>{
	let rol = roleByName(req.params.user);
	console.log(rol);
	if (rol == "manager") {
		res.send(branches);	
	}
	else
		res.send(400);
	res.end;
});
app.post('/login',(req, res) =>  {	
	
	req.on('data',c => {
		data = JSON.parse(c.toString());		
		console.log(data);
		if (role(data) != "") {			
			res.send({role: role(data)});
			res.end;
		}		
	});	
	
});

function role(data) {
	console.log("in role: " + data);
	for(i in users.managers){
		if(users.managers[i].userName == data.username && users.managers[i].password == data.password)
		{	
			if (users.managers[i].active)
			return "manager";			
		}
	}
	for(i in users.employees){
		if(users.employees[i].userName == data.username && users.employees[i].password == data.password)
		{			
			if (users.employees[i].active)
			return "employee";			
		}
	}
	for(i in users.customers){
		if(users.customers[i].userName == data.username && users.customers[i].password == data.password)
		{			
			if (users.customers[i].active)
			return "customer";
		}
	}		
	console.log("in role: nothing");					
	return "";
}

function roleByName(data) {
	console.log("role by - " + data);
	for(i in users.managers){
		if(users.managers[i].userName == data)
		{				
			if (users.managers[i].active)
			return "manager";			
		}
	}
	for(i in users.employees){
		if(users.employees[i].userName == data)
		{			
			if (users.employees[i].active)
			return "employee";
		}
	}
	for(i in users.customers){
		if(users.customers[i].userName == data)
		{			
			if (users.customers[i].active)
			return "customer";
		}
	}	

	return "";
}




