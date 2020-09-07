module.exports = (app) => {
	app.get("/git/api/*",async (req,res)=>{
		var dat = await fetch(`https://api.github.com${req.path.replace("/git/api","")}`);
		var json = await dat.json();
		res.send(json);
	})

	app.get("/pk/api/*",async (req,res)=>{
		var dat = await fetch(`https://api.pluralkit.me/v1/${req.path.replace("/pk/api","")}`);
		var json = await dat.json();
		res.send(json);
	})
}