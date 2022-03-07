const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthorization , verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

/* CREATE */

router.post("/" , verifyTokenAndAdmin ,async (req, res) => {
    const newProduct = new Product(req.body)
    console.log(newProduct,"new aaaaa");
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }catch (err) {
        res.status(500).json(err);
    }
})

/* UPDATE */
router.put("/:id", verifyToken, async(req, res) => {
    try {
        const updatedProduct  = await Product.findByIdAndUpdate(
            req.params.id, 
            {
            $set : req.body
            },
        {new : true}
        );
        res.status(200).json(updatedProduct);
    }catch(err) {
        res.status(500).json(err);
    }
});

// /* DELETE */

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted") 
    }catch(err) {
        res.status(500).json(err);
    }
})
// /* GET PRODUCT */

router.get("/find/:id", verifyTokenAndAdmin , async (req, res) => {
    try {
        const product =  await Product.findById(req.params.id)
        res.status(200).json(product);
    }catch(err) {
        res.status(500).json(err);
    }
})
// /* GET ALL PRODUCT */
// to test trong api van duoc // test lai di
router.get("/", verifyTokenAndAdmin , async (req, res) => {
    const qNew = req.query.new ;
    const qCategory = req.query.category ;
    // const lastYear = new Date(date.setFullYear(date.getFullYear() - 1)) ;
    try {
        let product ;

        if(qNew) {
            product = await Product.find().sort({ 
                createdAt: -1
            }).limit(1)
        }else if(qCategory) {
            product = await Product.find({categories:{
                $in: [qCategory],
            },
        });
        }else {
            product = await Product.find();
        }

        res.status(200).json(product);
    }catch(err) {
        res.status(500).json(err);
    }
})


module.exports = router ;