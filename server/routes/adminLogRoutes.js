const express = require('express');
const router = express.Router();
const adminLogController = require('../controllers/adminLogController');

router.get('/', adminLogController.getAllAdminLogs);
router.get('/:id', adminLogController.getAdminLogById);
router.post('/', adminLogController.createAdminLog);
router.put('/:id', adminLogController.updateAdminLog);
router.delete('/:id', adminLogController.deleteAdminLog);

module.exports = router;
