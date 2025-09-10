const express = require('express');
const Route = require('../models/Route');
const router = express.Router();

const { auth } = require('../middleware/auth');


router.get('/', async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
});

module.exports = router;
