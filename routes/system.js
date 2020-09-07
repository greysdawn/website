module.exports = (app) => {
	app.get('/api/sysid', async (req, res)=> {
		var id = await app.stores.extras.get('sysid');
		res.send({id: id});
	})

	app.put('/api/sysid', async (req,res)=> {
		if(req.verified) {
			var updated = await app.stores.extras.update('sysid', req.body.id);
			if(updated) res.send('OK');
			else res.status(500).send('ERR')
		} else {
			res.status(401).send('UNAUTHORIZED');
		}
	})

	app.get('/api/sysmembs', async (req, res) => {
		var id = await app.stores.extras.get('sysid');
		var sys = await axios(`https://api.pluralkit.me/v1/s/${id}/members`);
		var members = sys.data.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
		for(var i = 0; i < members.length; i++) {
			if(!members[i].description) continue;
			members[i].tmpdescription = stripper(conv.makeHtml(members[i].description),
			{
				allowedTags: [
					'em',
					'strong',
					'i',
					'b',
					'del',
					'u',
					'p',
					'a',
					'code',
					'pre',
					'br',
					'blockquote'
				]
			});
		}
		res.send(members);
	})
}