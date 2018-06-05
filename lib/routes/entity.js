const express = require('express');
const router = express.Router();
const hash = require('promise-hash/lib/promise-hash')
const _ = require('lodash');
/* GET home page. */
router.get('/entities/:keyURIComponent', async (req, res, next) => {
	try {
		let entity = await req.ds.getEntity(req.params.keyURIComponent);
		if (!entity) {
			res.redirect('/');
		}
		entity = req.ds.normalizeEntity(entity);
		const fields = Object.keys(entity).sort();
		const filters = req.ds.filters.filter(f => fields.includes(f));
		_.pullAll(fields, filters);
		fields.unshift(...filters);
		
		res.render('entity', {
			title: `DSUI ${req.ds.projectId}`,
			projectId: req.ds.projectId,
			entityName: req.ds.getReadableKey(req.ds.deserializeKey(req.params.keyURIComponent)),
			fields,
			entity,
			keyURIComponent: req.params.keyURIComponent
		});
	} catch (e) {
		next(e);
	}
});

module.exports = router;
