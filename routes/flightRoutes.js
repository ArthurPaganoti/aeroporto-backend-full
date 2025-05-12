const express = require('express');
const router = express.Router();
const fc = require('../controllers/flightController');

router.post('/', fc.create);
router.get('/', fc.list);
router.get('/:id', fc.get);
router.put('/:id', fc.update);
router.patch('/:id/status', fc.updateStatus);
router.patch('/:id/assign-gate', fc.assignGate);
router.delete('/:id', fc.delete);

module.exports = router;
