var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

var MorseNode=require('../models/morse');

function createToken(user) {
  var token = jsonwebtoken.sign({
    id: user._id,
    name: user.name,
    username: user.username
  }, secretKey, {
    expiresIn: 144000
  });
  return token;
}

module.exports = function(app, express, io)
{
	var api = express.Router();


	api.get('/all_stories', function(req,res){
		Story.find({},function(err,stories){

			if(err){
				res.send(err);
				return;
			}
			res.json(stories);
		});
	});

	api.post('/signup', function(req, res){

		var user = new User({

			name: req.body.name,
			username: req.body.username,
			password: req.body.password

		});
		var token=createToken(user);
		user.token=token;

		user.save(function(err){
			if(err){
				res.status(400).send({message: "Létező felhasználó"});
				return;
			}
			res.json({

				success:true,
				message: 'Sikeres regisztráció',
				token:user.token
			});
		});
	});

	api.get('/users', function(req, res){

		User.find({}, function(err, users){

			if(err)
			{
				res.send(err);
				return;
			}
			res.json(users);
		});
	});

	api.post('/login', function(req,res){

		User.findOne({
			username:req.body.username
			

		}).select('name username password token').exec(function(err, user){

			if(err) throw err;
			if(!user){
				res.status(403).send({message: "Nincs ilyen felhasználó"});
			}
			else if(user){

				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword){
					res.status(403).send({message: "Hibás jelszó"});
				}
				else {

					////token
					var token = user.token;
					res.json({

						success: true,
						message: "Sikeres bejelentkezés",
						token: token
					});
				}
			}
		});

	});

  api.post('/user/:username/message', function(req,res){

		User.findOne({

			username: req.params.username
			


		}).select('username').exec(function(err, user){

			if(err) throw err;
			if(!user){
				res.status(404).send({user: req.body.username, message: "Nincs ilyen felhasználó"});
			}
			else if(user){
				var morse=new MorseNode;

				var story = new Story({
				creator: req.body.username,
				content: morse.decode(req.body.content),
				reciever: req.params.username,

				});

				story.save(function(err, newStory){

				if(err){
					res.send(err);
					return
				}
				io.emit('story', newStory)
				res.json({message: "Üzenet elküldve"});
			});
			}
		});

	});

	api.get('/user/:username/message', function(req, res){

			var token=req.body.token || req.params.token || req.headers['x-acces-token'];

			var user=User.findOne({
			username:req.params.username
		}).select('token').exec(function(err, user){
			if(token)
			{

			if(token==user.token)
			{
				Story.find({reciever: req.params.username}, function(err, stories){
			

				if(err){
					res.status(401).send({message: "Nem létező felhasználó"});
					return;
				}
				res.json(stories);
				});
			}
			else res.status(403).send({message: "Hibás token"});
			}
			else res.status(401).send({message: "Hiányzó token"});
			
			

		});
	
			
	});



	api.use(function(req,res,next){

		console.log("Sombody just came to our app!");
		var token=req.body.token || req.params.token || req.headers['x-acces-token'];

		//check if exits
		if(token){

			jsonwebtoken.verify(token, secretKey, function(err,decoded){

				if(err){
					res.status(403).send({succes: false, message: "Sikertelen azonosítás"});

				}else{

					req.decoded=decoded;

					next();
				}

			});
		}else{

			res.status(403).send({succes:false, message: "Hibás vagy hiányzó token"});
		}

	});


	return api;
}