const bcrypt = require("bcrypt");
const Product = require("../models/Product");
const auth = require("../auth");

module.exports.addproduct = (req, res) => {
        let newProduct = new Product({
        name : req.body.name,
        category : req.body.category,
        description : req.body.description,
        price : req.body.price,
        src : req.body.src
    });

    Product.findOne({ name: req.body.name })
    .then(existingProduct => {
        if(existingProduct){
            return res.status(409).send({ error : 'Product already exists'});
        }
        return newProduct.save()
        .then(savedProduct => {
            res.status(201).send('Product successfully added.')
        })
        .catch(saveErr => {
            console.error("Error in save product: ", saveErr)
            res.status(500).send({error: 'Failed to save the product'})
        })
    })
    .catch(findErr => {
        console.error("Error in finding the product: ", findErr)
        return res.status(500).send({ error: "Error finding the product" });
    });
}; 


module.exports.getallproducts = (req, res) => {
    Product.find()
        .then(products => {
            res.send(products);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

module.exports.getallactiveproducts = (req, res) => {
    Product.find()
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

module.exports.getproduct = (req, res) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        return res.status(200).send({ product });
    })
    .catch(err => {
        console.error("Error in fetching the product: ", err)
        return res.status(500).send({ error: 'Internal Server Error' });
    })
    
};


module.exports.updateproduct = (req, res) => {
    const productId = req.params.productId;

    let updatedProduct = {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        src: req.body.src
    } 

    Product.findByIdAndUpdate(productId, updatedProduct, { new : true })
    .then(updatedProduct => {

        if(!updatedProduct) {
            return res.status(404).send({ error: 'Product not found'});
        } 
        return res.status(200).send({ 
            message: 'Product updated successfully', 
            updatedProduct: updatedProduct 
        })
    })
    .catch(err => {
        console.error("Error in updating a product: ", err)
        return res.status(500).send({error: 'Internal Server Error.'})
    });
};



module.exports.archiveproduct = (req, res) => {
    let updateActiveField = {
        isAvailable: false
    }
    if (req.user.isAdmin == true){
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(archiveProduct => {
            if (!archiveProduct) {
                return res.status(404).send({ error: 'Product not found' });
            }
            return res.status(200).send({ 
                message: 'Product archived successfully', 
                archivingProduct: archiveProduct 
            });
        })
        .catch(err => {
            console.error("Error in archiving a product: ", err)
            return res.status(500).send({ error: 'Internal Server Error' })
        });
    }
    else {
        return res.status(403).send(false);
    }
};

module.exports.activateproduc = (req, res) => {
    let updateActiveField = {
        isAvailable: true
    }
    if (req.user.isAdmin == true){
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(activateProduct => {
            if (!activateProduct) {
                return res.status(404).send({ error: 'Product not found' });
            }
            return res.status(200).send({ 
                message: 'Product activated successfully', 
                activatingProduct: activateProduct
            });
        })
        .catch(err => {
            console.error("Error in activating a product: ", err)
            return res.status(500).send({ error: 'Internal Server Error' })
        });
    }
    else{
        return res.status(403).send(false);
    }
};

module.exports.searchbyname = (req, res) => {
    const { name } = req.body;

    Product.find({ name: { $regex: name, $options: 'i' } })
        .then(products => {
            res.status(200).json(products);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

module.exports.searchbypricerange = (req, res) => {
    const { minPrice, maxPrice } = req.body;
    if (!minPrice || !maxPrice) {
        return res.status(400).json({ error: 'Both minPrice and maxPrice are required' });
    }
    Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
        .then(products => {
            res.json({ products });
        })
        .catch(error => {
            console.error('Error searching products by price range:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

module.exports.searchbycategory = (req, res) => {
    const { category } = req.body;

    Product.find({ category: { $regex: category, $options: 'i' } })
        .then(products => {
            res.status(200).json(products);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};
