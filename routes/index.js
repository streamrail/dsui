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
	promises.entities = req.ds.getEntities(query);
	promises.kinds = req.ds.getKinds();
	try {
		const { kinds, entities } = await hash(promises);
		entities.items = entities.items.map(item =>
			Object.keys(item).reduce((acc, key) => {
				acc[key] = _.isPlainObject(item[key]) || _.isArray(item[key]) ? JSON.stringify(item[key]) : item[key];
				return acc;
			}, {}))
		res.render('index', {
			title: `DSUI ${req.ds.projectId}`,
			projectId: req.ds.projectId,
			kinds,
			entities,
			query
		});
	} catch (e) {
		next(e);
	}
});

module.exports = router;
