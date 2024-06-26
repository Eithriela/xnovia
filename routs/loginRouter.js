const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/', loginController.login_page);
router.post('/', loginController.login);

module.exports = router;