const express = require("express");
const orderController = require("../controllers/orderController");
const auth = require("../auth");
const { verifyUser, verifyAdmin, isLoggedIn } = auth;

const router = express.Router();

router.post("/checkout", verify, orderController.checkout);

router.get("/myorders", verify, orderController.myorders);

router.get("/allorders", verify, verifyAdmin, orderController.allorders);

module.exports = router;
