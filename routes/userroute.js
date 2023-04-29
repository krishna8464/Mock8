const express = require("express")
const {UserModel} = require("../model/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {authenticate} = require("../Middleware/Authintication")
require("dotenv").config()

const userRoute = express.Router();

userRoute.post("/register",async(req,res)=>{
    const { name,email,password,address} = req.body;
    // res.send({name,email,password,address})
    try {
        let all_data = await UserModel.find({email});
        if(all_data.length === 0){
            bcrypt.hash(password, 5,async(err,val)=>{
                if(err){
                    res.status(201).send({"err":"login is not working"})
                }else{
                    let obj = {name,email,password: val,address}
                    const user = new UserModel(obj);
                    await user.save()
                    res.send("User registered Successfully")
                }
            })
        }else{
            res.send({"msg":"User already Regester"})
        }
    } catch (error) {
        res.send({"msg":"Error in registering the user"})
        console.log(error)
    }
})

userRoute.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    
    try {
        const user = await UserModel.find({email});
        const hashed_pass = user[0].password;
        if(user.length>0){
            bcrypt.compare(password,hashed_pass,(err,result)=>{
                if(result){
                    const token = jwt.sign({userid:user[0]._id},process.env.KEY);
                    res.status(201).send({"msg":"Login Successfull","username":user[0].name,"email":user[0].email,"Access_Token":token})
                }else{
                    res.send({"msg":"Wrong Credntials"})
                }
            })
        }else{
            res.send({"msg":"User Not registered"})
        }
    } catch (error) {
        res.send({"msg":"some thing went wrong in login"})
    }
})


userRoute.use(authenticate)

userRoute.patch("/user/reset",async(req,res)=>{
    let Id = req.body.userid
    const {password,newpassword} = req.body
    try {
        const user = await UserModel.find({_id:Id});
        if(user.length === 0){
            res.send({"msg" : "NO user found"})
        }else{
            let hashed_pass = user[0].password;
            bcrypt.compare(password,hashed_pass,(err,result)=>{
                if(result){
                    bcrypt.hash(newpassword, 5,async(err,val)=>{
                        if(err){
                            res.status(201).send({"err":"this route is not working"})
                        }else{
                            let obj = {password: val}
                            await UserModel.findByIdAndUpdate({_id:Id},obj);
                            res.send("Password Updated Successfully")
                        }
                    })


                }else{
                    // console.log(err)
                    res.send({"msg":"Wrong Password"})
                }
            })
        }
    } catch (error) {
        res.send("Some thing went wrong in change password route")
    }
})



module.exports={
    userRoute
}