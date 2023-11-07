const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const uploadMiddleware = multer({ storage: multer.memoryStorage() });
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const admin = require('firebase-admin');

// Load environment variables from .env file
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG)),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
const storage = admin.storage().bucket();

app.use((_, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173'); // or 'localhost:8888'
  res.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  return next();
});
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))

const salt = bcrypt.genSaltSync(10);

// Access environment variables
const secret = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGODB_URI);

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userDoc = await User.findOne({ username });

        if (!userDoc) {
            return res.status(400).json('User not found');
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);

        if (passOk) {
            const token = jwt.sign({ username, id: userDoc._id }, secret);
            res.cookie('token', token, { httpOnly: true }); // Set the JWT token in a cookie
            res.json({ username, id: userDoc._id }); // Return user information
        } else {
            res.status(400).json('Wrong credentials');
        }
    } catch (error) {
        console.error('An error occurred during login:', error);
        res.status(500).json('Server error');
    }
});

app.get('/profile', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json('JWT token not provided');
    }

    jwt.verify(token, secret, (err, info) => {
        if (err) {
            return res.status(401).json('JWT token is invalid');
        }
        res.json(info);
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the 'token' cookie
    res.status(200).json('Logged out successfully');
});


app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { token } = req.cookies;
  
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(401).json('JWT token is invalid');
      }
  
      const { title, summary, content } = req.body;
      const file = req.file;
  
      if (!file) {
        return res.status(400).json('No file uploaded');
      }
  
      // Upload the file to Firebase Storage
      const fileExtension = file.originalname.split('.').pop();
      const storagePath = `${uuidv4()}.${fileExtension}`;
      const fileUpload = storage.file(storagePath);
  
      fileUpload.createWriteStream()
        .end(file.buffer);
  
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: storagePath, // Store the Firebase Storage path in your database
        author: info.id,
      });
  
      res.json(postDoc);
    });
  });


app.get('/post', async(req, res) => {
    res.json(await Post.find().sort({ createdAt: -1 }).populate('author', ['username']));
})

app.put('/post', uploadMiddleware.single('file'), async(req, res)=>{
    
    
    
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        let storagePath = null;
        const {id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        
        const filePath = postDoc.cover;
        
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (req.file) {
            const file = req.file;
            const fileExtension = file.originalname.split('.').pop();
            storagePath = `${uuidv4()}.${fileExtension}`;
            const fileUpload = storage.file(storagePath)
            
      
            fileUpload.createWriteStream()
            .end(file.buffer);
            
            }
        if (err) {
            return res.status(401).json('JWT token is invalid');
        }
        
        if(!isAuthor){
            return res.status(400).json('you are not the author of this post');
        }

        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: storagePath ? storagePath : postDoc.cover
        })
        

        res.json(postDoc);
    });
    
})

app.get('/post/:id', async(req, res) =>{
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);

})


app.listen(4000);