const express = require('express');
const router = express.Router();
const gc = require('../controllers/gateController');

router.post('/', gc.create);
router.get('/', gc.list);
router.get('/:id', gc.get);
router.put('/:id', gc.update);
router.delete('/:id', gc.delete);

module.exports = router;
