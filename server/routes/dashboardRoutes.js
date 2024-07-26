const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dashboard Routes
router.get('/summary', dashboardController.getDashboardSummary);
router.get('/most-sold-products', dashboardController.getMostSoldProducts);
router.get('/most-sold-categories', dashboardController.getMostSoldCategories);
router.get('/sales-overview', dashboardController.getSalesOverview);
router.get('/recent-activity', dashboardController.getRecentActivity);

module.exports = router;
