import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import Blog from './models/blog.js';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
dotenv.config();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// show all blogs
app.get("/api/blogs",async(req,res) => {
    const blogs = await Blog.find().sort({createdAt:-1});
    res.json(blogs);
});

// create new blog
app.post("/api/blogs",async(req,res) => {
    try{
        const blog= await Blog.create(req.body);
        res.status(201).json(blog);        
    } catch(error){
        res.status(500).json({error: "Error creating blog"})
    }
});

// show single blog
app.get("/api/blogs/:id",async(req,res) =>{
  try{
  const blog = await Blog.findById(req.params.id);
  res.json(blog);    
  } catch(error){
    res.status(500).json({error:"Blog not found"})
  }
})

// update blog
app.put("/api/blogs/:id", async (req, res) => {
    try{
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.json(blog);    
    } catch(error){
        res.status(500).json({error: "Error updating blog"})
    }
});

// delete blog
app.delete("/api/blogs/:id", async (req, res) => {
    try{
    await Blog.findByIdAndDelete(req.params.id);
    res.json({message: "deleted successfully"});        
    } catch(error){
        res.status(500).json({error:"Blog not deleted"})
    }
});

mongoose.connect (process.env.MONGO_URI)
.then(() =>{
    console.log("Connected to database")
    app.listen(3000, () =>{
        console.log('Server is running on port 3000');
    });  
})
.catch(() =>{
    console.log("Connection failed!");
});