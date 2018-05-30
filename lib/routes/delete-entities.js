const express = require('express');
const router = express.Router();
const _ = require('lodash');
router.post('/delete-entities/', async (req, res, next) => {
    try {
        if (req.body.keys) {
            let targetKeys = _.isArray(req.body.keys) ? req.body.keys : [req.body.keys];
            targetKeys = targetKeys.map(decodeURIComponent);
            await req.ds.deleteEntities(targetKeys);
        }
        res.redirect(req.header('Referer'))
    } catch (e) {
        next(e);
    }
});

module.exports = router;
