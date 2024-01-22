const express = require("express");
const router = express.Router();

const Object = require("../models/model");

router.get("/", async(req,res)=>{
    const data = await Object.find();
    res.render("home",{
        title : "Home Page",
        data : data,
        req : req
    });
});

router.get("/add", async(req,res)=>{
    res.render("add_cafe",{
        title : "Add Cafe"
    });
});

router.get("/rate/:id", async(req,res)=>{
    const id = req.params.id;
    try{
        const cafe = await Object.findById(id);
        res.render("review",{
            title : "Add Cafe",
            data : cafe
        });
    }
    catch(error){
        res.status(401);
        console.log("Error in finding cafe");
        res.redirect("/");
    }
    
});

router.post("/rate/:id", async(req,res)=>{
    const id = req.params.id;
    let rating = parseInt(req.body.rating);
    try{
        const cafe = await Object.findById(id);
        const ratingSum = parseInt(cafe.reviewSum) + rating;
        const ratingCount = parseInt(cafe.reviewCount)+1;
        await Object.findByIdAndUpdate(id,{
            reviewCount : ratingCount,
            reviewSum : ratingSum
        });

        req.session.message = {
            type: "success",
            message: "Rating added successfully!"
        };

        res.redirect("/");

    }
    catch(error){
        res.status(401);
        console.log("Error while rating");
        res.redirect("/rate/:"+id);
    }
    
});

router.post("/add", async(req,res)=>{
    console.log("name ", req.body.name);
    console.log("phone ", req.body.phone);
    try{
        const cafe = new Object({
            name : req.body.name,
            phone : req.body.phone,
            reviewSum : 0,
            reviewCount : 0
        });
        await cafe.save();
        req.session.message = {
            type: "success",
            message: "Cafe added successfully!"
        };
        res.redirect("/");
    }
    catch{
        res.status(401);
        throw new Error("Problem in adding the cafe");
    }
})


module.exports = router;