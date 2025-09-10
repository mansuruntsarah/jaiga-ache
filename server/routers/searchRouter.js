const express = require('express');
const router = express.Router();
const { searchRoutes } = require('../controllers/searchController');

router.post('/', searchRoutes);

module.exports = router;
