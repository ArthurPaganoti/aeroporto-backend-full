const express = require('express');
const router = express.Router();
const pc = require('../controllers/passengerController');

router.post('/', pc.create);
router.get('/', pc.list);
router.get('/:id', pc.get);
router.put('/:id', pc.update);
router.patch('/:id/checkin', pc.checkIn);
router.delete('/:id', pc.delete);

module.exports = router;
