module.exports = (app) => {
	app.get('/api/contacts', async (req, res)=> {
		var contacts = await app.stores.contacts.getAll();
		res.send(contacts);
	})
}