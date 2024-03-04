const express = require("express");
const orderController = require("../controllers/orderController");
const auth = require("../auth");
const { verifyUser, verifyAdmin, isLoggedIn } = auth;

const router = express.Router();

router.post("/checkout", verifyUser, orderController.checkout);

router.get("/myorders", verifyUser, orderController.myorders);

router.get("/allorders", verifyUser, verifyAdmin, orderController.allorders);

module.exports = router;
