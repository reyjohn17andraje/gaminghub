const express = require("express");
const productController = require("../controllers/productController");
const Product = require("../models/productModel");
const auth = require("../auth");
const { verifyUser, verifyAdmin, isLoggedIn } = auth;


const router = express.Router();

router.post("/addproduct", verifyUser, verifyAdmin, productController.addproduct); 

router.get("/allproducts", verifyUser, verifyAdmin, productController.getallproducts);

router.get("/allactiveproducts", productController.getallactiveproducts);

router.get("/:productId", productController.getproduct);

router.put("/:productId/updateproduct", verifyUser, verifyAdmin, productController.updateproduct);

router.patch("/:productId/archiveproduct", verifyUser, verifyAdmin, productController.archiveproduct);

router.patch("/:productId/activateproduct", verifyUser, verifyAdmin, productController.activateproduct);

router.post('/searchbyname', productController.searchbyname);

router.post('/searchbypricerange', productController.searchbypricerange);

router.post('/searchbycategory', productController.searchbycategory);

router.delete('/deleteproduct', productController.deleteproduct);

module.exports = router;
