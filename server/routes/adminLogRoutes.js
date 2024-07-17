const express = require('express');
const adminLogController = require('../controllers/adminLogController');

const router = express.Router();

router.get('/', adminLogController.getAllAdminLogs);
router.get('/:id', adminLogController.getAdminLogById);
router.post('/', adminLogController.createAdminLog);
router.put('/:id', adminLogController.updateAdminLog);
router.delete('/:id', adminLogController.deleteAdminLog);

module.exports = router;
