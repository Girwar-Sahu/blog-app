import express from "express"
import multer from "multer"
import Blog from "../models/blog.js"
import Comment from "../models/comment.js"
const router = express.Router()

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './public/uploads')
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = new Date().toISOString().replace(/:/g, "-") + file.originalname
      cb(null, uniqueSuffix)
   }
})

const upload = multer({storage: storage})


router.get('/add-new', (req, res) => {
   res.render('addBlog', {
      user: req.user
   })
})

router.get('/:id', async(req, res)=>{
   const blog = await Blog.findById(req.params.id).populate('createdBy')
   const comments = await Comment.find({blogId: req.params.id}).populate('createdBy')
   res.render('blog', {
      user: req.user,
      blog,
      comments
   })
})

router.post('/comment/:id', async(req, res) => {
   await Comment.create({
      content: req.body.content,
      blogId: req.params.id,
      createdBy: req.user._id
   })
   return res.redirect(`/blog/${req.params.id}`) 
})

router.post('/add-new',upload.single('coverImg'), async(req, res) => {
   const {title, body} = req.body
   const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImgUrl: req.file.filename
   })
   res.redirect(`/blog/${blog._id}`)
})

export default router