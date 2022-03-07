const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization , verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

/* CREATE */

router.post("/" , verifyToken ,async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }catch (err) {
        res.status(500).json(err);
    }
})

/* UPDATE */
router.put("/:id", verifyTokenAndAdmin, async(req, res) => {
    try {
        const updatedOrder  = await Cart.findByIdAndUpdate(
            req.params.id, 
            {
            $set : req.body
            },
        {new : true}
        );
        res.status(200).json(updatedOrder);
    }catch(err) {
        res.status(500).json(err);
    }
});

// /* DELETE */

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted") 
    }catch(err) {
        res.status(500).json(err);
    }
})
// /* GET USER ORDER */   

router.get("/find/:userId", verifyTokenAndAdmin , async (req, res) => {
    try {
        const order =  await Order.find({userId: req.params.userId})
        res.status(200).json(order);
    }catch(err) {
        res.status(500).json(err);
    }
})
// /* GET ALL  */

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const order = await Order.find();

        res.status(200).json(order);
    }catch(err) {
        res.status(500).json(err);
    }
})

/* GET MONTHLY INCOME */

router.get('/income' , verifyTokenAndAdmin , async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));

    try {
        const income = await Order.aggregate([
            {$match:{ createdAt: {$gte : previousMonth } , ...(productId && {
                product: [
                    { $elemMatch:{productId}}
                ]
            })} },
            {
                $project:{
                    month: {$month:"$createdAt"},
                    sales:"$amount",
                },
            },
            {
                $group : {
                    _id: "$month",
                    total: {$sum : "$sales"},
            },
        },
   
        ]);
        res.status(200).json(income);
    }catch (err) {
        res.status(500).json(err);
        
    };
});

module.exports = router ;