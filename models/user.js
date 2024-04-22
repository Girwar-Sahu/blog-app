import mongoose from "mongoose"
import {createHmac, randomBytes} from "node:crypto"
import { createToken } from "../services/auth.js"

const userSchema = new mongoose.Schema({
   fullName :{
      type: String,
      require : true
   },
   email:{
      type: String,
      require: true,
      unique: true
   },
   imageUrl:{
      type: String,
      default : "/images/user.png"
   },
   role:{
      type: String,
      enum : ["USER","ADMIN"],
      default: "USER"
   },
   salt:{
      type: String,
   },
   password:{
      type: String,
      require: true
   }
},{timestamps: true})

userSchema.pre('save', function(next){
   const user = this
   if(!user.isModified('password')) return
   
   const salt = randomBytes(16).toString()
   const hashedPassword = createHmac('sha256',salt)
   .update(user.password)
   .digest('hex')

   this.salt = salt
   this.password = hashedPassword

   next()
})

userSchema.static('matchPassword', async function(email, password){
   const user = await this.findOne({email})
   if(!user) throw new Error('User no found')
   
   const salt = user.salt
   const hashedPassword = user.password

   const userProvidedPassword = createHmac('sha256',salt)
   .update(password)
   .digest('hex')

   if(hashedPassword !== userProvidedPassword)
    throw new Error('incorrect pasword')
   const token = createToken(user)
   return token
})


export default mongoose.model('user', userSchema)