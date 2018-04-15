const express = require('express');
const router = express.Router();
const hash = require('promise-hash/lib/promise-hash')
const _ = require('lodash');
/* GET home page. */
router.get('/entities/:keyURIComponent', async (req, res, next) => {
  try {
    let entity = await req.ds.getEntity(req.params.keyURIComponent);
    entity = Object.keys(entity).reduce((acc, key) => {
      acc[key] = _.isPlainObject(entity[key]) || _.isArray(entity[key]) ? JSON.stringify(entity[key]) : entity[key];
      return acc;
    }, {});
    const fields = Object.keys(entity);
    _.pull(fields,'Id');
    _.pull(fields, 'Name');
    fields.unshift('Name');
    fields.unshift('Id');

    res.render('entity', { 
      title: `DSUI ${req.ds.projectId}`,
      projectId: req.ds.projectId,
      entityName: req.ds.deserializeKey(req.params.keyURIComponent).path.join(': '),
      fields,
      entity
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
