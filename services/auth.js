import jwt from "jsonwebtoken"
const secret = "19dns09erjJW(UR)U@"

export const createToken = (user) => {
   const payload = {
      _id : user._id,
      name: user.fullName,
      email : user.email,
      imageUrl : user.imageUrl,
      role : user.role
   }

   const token = jwt.sign(payload, secret)
   return token
}

export const validateToken = (token) => {
   const payload = jwt.verify(token, secret)
   return payload
}