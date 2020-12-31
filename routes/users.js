const SHA3 = require('crypto-js/sha3');
const crypto = require('crypto');

module.exports = (app) => {
	app.get("/api/user",async (req,res)=>{
		res.send(req.session.user);
	})

	app.get('/api/users', async (req,res)=>{
		if(!req.session.user) return res.status(401).send('UNAUTHORIZED');
		
		var users = await app.stores.users.getAll();
		res.send(users);
	})

	app.post('/api/user', async (req,res)=>{
		if(!req.session.user) return res.status(401).send('UNAUTHORIZED');
		
		try {
			var salt = crypto.randomBytes(32).toString('base64');
			req.body.password = SHA3(req.body.password + salt).toString();
			var user = await app.stores.users.create(app.utils.genCode(), { ...req.body, salt });
		} catch(e) {
			return res.status(500).send('ERR');
		}

		return res.status(200).send(user);
	})

	app.get('/api/user/:hid', async (req,res)=> {
		try {
			var user = await app.stores.users.get(req.params.hid);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		if(user) res.status(404).send('User not found.');
		else res.send(user);
	})

	app.get('/api/user/:hid/delete', async (req,res)=>{
		if(!req.session.user) return res.status(401).send('UNAUTHORIZED');
		
		try {
			await app.stores.users.delete(req.params.hid);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		res.send();
	})

	app.delete('/api/user/:hid',async (req,res)=>{
		if(!req.session.user) return res.status(401).send('UNAUTHORIZED');
		
		try {
			await app.stores.users.delete(req.params.hid);
		} catch(e) {
			return res.status(500).send('ERR');
		}

		res.send();
	})

	app.post('/api/login', async (req,res)=> {
		var user = await app.stores.users.auth(req.body.name, req.body.pass);
		if(!user) return res.status(404).send();

		req.session.user = user;
		res.status(200).send("OK");
	});
}