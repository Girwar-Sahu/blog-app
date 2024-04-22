import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import path from 'path';
import userRoute from "./routes/userRouter.js"
import blogRoute from "./routes/blogRoutes.js"
import Blog from "./models/blog.js"
import { checkAuthenticationCookie } from "./middleware/authentication.js"

const __dirname = path.resolve()
const app = express()
const PORT = process.env.PORT || 3000

const connect = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URL)
      console.log("connected to MongoDB");
   } catch {
      throw error
   }
}


app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(checkAuthenticationCookie('token'))

app.get('/', async(req, res) => {
   const allBlog = await Blog.find()
   res.render('home',{
      user: req.user,
      blogs: allBlog 
   })
})

app.use('/users', userRoute)
app.use('/blog', blogRoute)

app.listen(PORT, () => {
   connect()
   console.log(`server started at port : ${PORT}`)
})