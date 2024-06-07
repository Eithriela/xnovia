const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.use('/:id', userController.user_auth_status);
router.get('/:id', userController.user_details);
router.get('/:id/logout', userController.user_logout);
module.exports = router;