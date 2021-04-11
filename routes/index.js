var express = require('express');
var router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const usersDB = require('../model')('users');
const branchsDB = require('../model')('Branchs');
const flowersDB = require('../model')('flowers');
var multer = require('multer');

const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, 'public/images/');
	},
	filename: (req, file, cb) => {	  
	  cb(null, `${file.originalname}`);
	}
  });
var upload = multer({storage: multerStorage});
router.use(express.urlencoded());
router.use(express.json());
/* GET home page. */
router.get('/', function(req, res, next) {  
	console.log("first time!");
	res.render('index', { title: 'Express' });
});

async function addFlower(detail) {
	flower = []
	flower[0] = detail.url
	flower[1] = detail.descreption
	flower[2] = detail.color
	flower[3] = detail.cost
	flowersDB.CREATE(flower)
} 

router.post('/upload-image/:user',upload.single('uploaded_file'),async function (req,res) {
	data = req.body
	if (req.file) {
		req.file.filename = req.file.originalname		
		data.url = 'images/' + req.file.filename;
		console.log(data);
	}
	await addFlower(data)
	res.end;
})


router.get('/catalog/:user',async (req,res) =>{
	let user = await usersDB.find({userName:req.params.user});
	flowersArr = await flowersDB.find({});
	if (user != [])
		res.render("catalog.ejs",flowersArr);
	else
		res.send(400);
	res.end;
	
});

router.get('/about',(req, res) =>  {
	res.render("about.ejs");		
});

router.get('/contact',(req, res) =>  {
	res.render("contact.ejs");		
});

router.get('/role/:username',async (req, res) =>  {
	let user = await usersDB.find({userName:req.params.username});
	res.end(user[0].role );
		
});

router.get('/Manage_branches/:user',async (req,res) =>{	
	console.log("Branchs!!!!!");
	let user = await usersDB.find({userName: req.params.user} );
	let branchs = await branchsDB.find({});
	//console.log(branchs);
	if (user[0].role == "manager") {
		console.log("no problem");		
		res.send(branchs);	
	}
	else
		res.send(200);
	res.end;
});
router.post('/login',async (req, res) =>  {	
	console.log("catch it!");
	let body = req.body;
	let user = await usersDB.find({userName:body.username} );
			
	console.log(user[0].role);
	if (user != []) {
		res.send( {role: user[0].role});
		res.end;
	}	
	else{
		res.status(404);
		res.end;
	}

});

module.exports = router;
