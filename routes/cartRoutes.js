const express = require("express");
const cartController = require("../controllers/cartController");
const auth = require("../auth");
const { verifyUser, verifyAdmin, isLoggedIn } = auth;

const router = express.Router();

router.get("/getcart", verifyUser, cartController.getcart); 

router.post("/addtocart", verifyUser, cartController.addtocart);

router.put("/updatecartquantity", verifyUser,cartController.updatecartquantity); 

router.delete('/:productId/removefromcart', verifyUser, cartController.removefromcart);

router.delete('/clearcart', verifyUser, cartController.clearcart);

module.exports = router;
