import mongoose from 'mongoose';
const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
}, {timestamps:true})

export default mongoose.model('Blog', blogSchema);