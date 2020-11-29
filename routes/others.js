const axios = require('axios');

module.exports = (app) => {
	app.get("/git/api/*",async (req,res)=>{
		var dat = await axios(`https://api.github.com${req.path.replace("/git/api","")}`);
		res.send(dat.data);
	})

	app.get("/pk/api/*",async (req,res)=>{
		var dat = await axios(`https://api.pluralkit.me/v1/${req.path.replace("/pk/api","")}`);
		res.send(dat.data);
	})
}