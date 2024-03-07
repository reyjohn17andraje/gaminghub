const express = require('express');
const userController = require('../controllers/userController');
const { verifyUser, verifyAdmin, isLoggedIn } = require('../auth');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/details', verifyUser, userController.details);
router.get('/getusers', verifyUser, verifyAdmin, userController.getusers);
router.put('/updatedetails', verifyUser, userController.updatedetails);
router.patch('/updatepassword', verifyUser, userController.updatepassword);
router.patch('/:userId/remove-admin', verifyUser, userController.removeasadmin);
router.patch('/:userId/set-as-admin', verifyUser, userController.changetoadmin);

module.exports = router;