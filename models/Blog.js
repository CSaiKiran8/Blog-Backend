import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({ 
  title: { type: String,required: true,},
  desc: { type: String,required: true,},
  image: { type: String,required: true,},
  userId: { type: String, required: true },
  name:{type: String,required: true},
},
{ timestamps: true }
);

export default mongoose.model("Blog", blogSchema);