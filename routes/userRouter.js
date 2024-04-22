import user from "../models/user.js";
import User from "../models/user.js";
import express from "express";
const route = express.Router() 

route.get('/signup', (req,res) => {
   res.render('signup')
})

route.get('/login',(req,res)=>{
   res.render('login')
})

route.post('/signup',async(req,res)=>{
   const {fullName, email, password} = req.body
   await User.create({
      fullName,
      email,
      password
   })
   res.redirect('/')
})

route.post('/login', async(req,res) => {
   const {email, password} = req.body
   try{
      const token = await User.matchPassword(email, password)
      return res.cookie('token', token).redirect('/')
   }
   catch(error){
      return res.render('login',{error: "incorrect email or password"})
   }
})

route.get('/logout', (req,res)=> {
   res.clearCookie('token').redirect('/')
})

export default route