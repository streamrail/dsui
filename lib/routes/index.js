const express = require('express');
const router = express.Router();
const hash = require('promise-hash/lib/promise-hash')
const _ = require('lodash');
/* GET home page. */
router.get('/', async (req, res, next) => {
	const query = {
		page: 1,
		itemsPerPage: 10,
		stringifyObjects: true,
		...req.query
	}
	const promises = {};
	const kind = req.query.kind;
	try {
		promises.entities = req.ds.getEntities(query);
		promises.namespaces = req.ds.getNamespaces();
		const { entities, namespaces } = await hash(promises);
		const kinds = await req.ds.getKinds(namespaces)
		entities.items = entities.items.map(item => req.ds.normalizeEntity(item));
		res.render('index', {
			title: `DSUI ${req.ds.projectId}`,
			projectId: req.ds.projectId,
			namespaces,
			kinds,
			filters: req.ds.filters,
			entities,
			query
		});
	} catch (e) {
		next(e);
	}
});

module.exports = router;
