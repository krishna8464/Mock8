const express = require("express");
const {ResturentModel} = require("../model/resturentmodel")
// const {authenticate} = require("../Middleware/Authintication")
const {MenuModel} = require("../model/menumodel")
require("dotenv").config()

const resturentRoute = express.Router();



resturentRoute.post("/createresturent",async(req,res)=>{
    const {name} = req.body;
    try {
        let check = await ResturentModel.find({name});
        if(check.length===0){
        const rest = new ResturentModel(req.body);
        await rest.save();
        res.send({"msg" : "Resturent created"})
        }else{
            res.send({"msg": "A resturent already present with the same name"})
        }
    } catch (error) {
        res.send({"msg":"Some thing went wrong in the create resturent"})
    }
})


resturentRoute.get("/restaurants",async(req,res)=>{
    let all = await ResturentModel.find({});
    try {
        res.send(all)
    } catch (error) {
        res.send({"msg":"Some thing went wrong in get route"})
    }
})

resturentRoute.get("/restaurants/:id",async(req,res)=>{
    let id = req.params.id;
    console.log(id)
    try {
        let data = await ResturentModel.findOne({_id:id});
        if(data){
            res.send(data)
        }else{
            res.send({"msg":"The given id is wrong "})
        }
        
    } catch (error) {
        res.send({"msg":"Some thing went wrong in get route"})
    }
})

resturentRoute.get("/restaurants/:id/menu",async(req,res)=>{
    let id = req.params.id;
    console.log(id)
    try {
        let data = await ResturentModel.findOne({_id:id});
        if(data){
            res.send(data.menu)
        }else{
            res.send({"msg":"The given id is wrong "})
        }
        
    } catch (error) {
        res.send({"msg":"Some thing went wrong in get route"})
    }
})


resturentRoute.post("/restaurants/:id/menu",async(req,res)=>{
    let id = req.params.id;
    let body = req.body;
    req.body.hotelid=id
    let {name,description,price} = req.body
    console.log(id)
    try {
        let data = await ResturentModel.findOne({_id:id});
        if(data){
            const rest = new MenuModel(req.body);
            await rest.save();
            let obj = await MenuModel.find({hotelid:id})
            let pushobj = {menu : obj}
            await ResturentModel.findByIdAndUpdate({_id:id},pushobj);
            data = await ResturentModel.findOne({_id:id});
            res.send({"msg":"Item added successfully"})
        }else{
            res.send({"msg":"The given id is wrong "})
        }
    } catch (error) {
        res.send({"msg":"Some thing went wrong in get route"})
    }
})


resturentRoute.delete("/restaurants/:id/menu/:id",async(req,res)=>{
    let Id = req.params.id;
    // res.send(Id)
    try {
        let data = await MenuModel.findOne({_id:Id});
        if(data){
           let menudet =  await MenuModel.findByIdAndDelete({_id:Id});
           let userid = menudet.hotelid;
           let obj = await MenuModel.find({hotelid:userid})
            let pushobj = {menu : obj}
            await ResturentModel.findByIdAndUpdate({_id:userid},pushobj);
            res.status(202).send(`item with id : ${Id} deleted successfully`)
        }else{
            res.send(`There is no item with the id : ${Id} to Delete`)
        }
    } catch (error) {
        console.log(error)
        res.send({"msg":"Some thing went wrong in item delete route"})
    }
})





module.exports={
    resturentRoute
}


