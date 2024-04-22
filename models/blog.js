import mongoose, { Schema } from "mongoose";

const BlogSchema = new mongoose.Schema({
   title: {
      type: String,
      require: true
   },
   body: {
      type: String,
      require: true
   },
   coverImgUrl: {
      type: String,
   },
   createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
   }
}, {timestamps: true})

export default mongoose.model('blog', BlogSchema)
