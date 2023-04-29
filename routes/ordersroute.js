const express = require("express");
const {ResturentModel} = require("../model/resturentmodel")
const {authenticate} = require("../Middleware/Authintication")
const {MenuModel} = require("../model/menumodel");
const {OrderModel}  = require("../model/ordermodel")
const {UserModel} = require("../model/usermodel");
require("dotenv").config()

const orderRoute = express.Router();




orderRoute.use(authenticate)

orderRoute.post("/orders",async(req,res)=>{
    const {resturentid} = req.body;
    let userid = req.body.userid
    try {
        let user = await UserModel.findOne({_id:userid});
        let resturent = await ResturentModel.findOne({_id:resturentid});
        let menu = resturent.menu;
        let cost = 0;
        for(let i = 0;i<menu.length;i++){
            cost += menu[i].price
        }
        let address = user.address;
        let status = "placed";
        let obj = {
            user : user,
            restaurant : resturent,
            items : menu,
            totalPrice : cost,
            deliveryAddress : address,
            status : status
        }

        const order = new OrderModel(obj);
        await order.save();
        res.send({"msg": "Order Placed"})
    } catch (error) {
        res.send({"msg": "order declined"})
    }
})

orderRoute.get("/orders/:id",async(req,res)=>{
    let id = req.params.id;
    try {
        let data = await OrderModel.findOne({_id:id});
        res.send(data)
        
    } catch (error) {
        res.send("some thing went wrong")
    }
})

orderRoute.patch("/orders/:id",async(req,res)=>{
    let id = req.params.id;
    const {status} = req.body
    try {

        await OrderModel.findByIdAndUpdate({_id:id},{status});
        res.send({"msg":"The order status updated"})
        
    } catch (error) {
        res.send("some thing went wrong")
    }
})


module.exports={
    orderRoute
}