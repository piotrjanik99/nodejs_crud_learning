const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

//REGISTER
router.post("/register", async (req,res)=> {
    try {
        const randomSalt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, randomSalt);
        const newUser = new User ({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err) {
        res.status(500).json(err);
    }
})

//LOGIN
router.post("/login", async (req,res)=> {
    try {
        const user = await User.findOne({ username: req.body.username })
        const validatedPass = await bcrypt.compare(req.body.password, user.password);

        if(!user || !validatedPass) {
            return res.status(400).json("Incorrect login or password")
        } else {
            const { password, ...others } = user._doc;
            res.status(200).json(others);
        }

    }catch(err) {
        res.status(500).json(err);
    }
})


module.exports = router;