const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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

// Load environment variables
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "zenblog-8e899",
    "private_key_id": "47e574b8412cd1819aa1f205e1085b3c602dfd27",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8mwrv0gZYmNfu\n1NnrXRVNWeAvNUdqE3Bnpz0SJDrsXU33auSeKKJaSX4rKJiuc4hwidfSLTZI92kc\nSv3KuglelvlCCxe/HMUGCvzysWJDED+k3tVQ26Pu/ERx/ox+9tVurpuns9ihjloC\nJ7GHAVcq1Lk/VAtmsxawYgKSHACzQgIYmHiwcm7mi8Ab6/xFTGXQHMCSdj76LNkJ\nv/KS3pemntJP6HCpGVjd+0QGym8hFO2LcYZkzjmR6rz59WQvUJk4xglRcHj73yXC\nfjc2xGS0kfZOcn1E7e4O/gck6PyPmwlMQ7yt1jt/zMDAejPoMjZdlx4+UX5KCOzf\niOSdaIgzAgMBAAECggEAC1Xa1EC7CT51FTwYCtQchc/F2wsoiyC29paFDkmSJwbm\nkDJi93nOuX7FmqIafGWiM3f9ZNA7J9XYLI9PQzdnfRa1eA7YSFqvdrut/zIXtfB3\nOsP6bcfS9E1CGdh9fjCnRuXZ92bQ5B4nnQ3grBIHDffHWHMx1OQk6XNCifXX5ENp\nJzdCKz7vYupuPX9SSoW7Q9Jn+ERqQ3Z11uU07gPAEp8pR1N1iIn27d2ZzBwNynOO\npT5vvZx26EV4JDw8m4b4nprC8GkMyT+aon7KolDlMdqXDf+AgjlnIgCoQFy5Zf6+\n5cYC1jbyTCjHrDied8BuAQdVx41t38R8WES4M81BUQKBgQD986+kI3S9u0HwQIW1\nFUNJJWxpRzQJbYmCA+pisoXxbLsdrA80uiVQfVLCKUwuPkaxjEaGTyjG4o1Kv/+x\ncsXhDtZgMFH4x2VnTNLdNFYCUD4QD+Cv35dDIybqYyCPf79uTRm/PFqOCrUJKZdB\nYa3GwP9Eo0EeZz8ENxaELErL8QKBgQC+IHEFhfnIqcoDVjviIeBU0Wc5wPsX0pbi\ngk4onoR4np1gvp8VpvN1745egXXw0vI2h02ZiC9EKqUNra2sbP6+3TUzhcucKlq/\n30oGlTfJ7r8D5cX98UEhqQ0SvyQzu+MhS2LXdhycx5NeOQb5ZAXop5Zr+q2T7B/b\nHKbRXghKYwKBgQDMLKdTjVonzS1Xj1iw3ZaKcbc28ZNp3RKIYMOKdMPx9hx+374e\nA2dKzmfCSVfBejp2NzTgeTZsqOs2ZSWbso5bwwUistbE8PObWQ3T4WchVwh++3UH\nkfnYdaOtIOOl2+y6Luz7bvfTadJhunmsjG8d9D+IHMWXPyVQK0ZEICRG0QKBgFzi\n2JTMOZZRbUJoFOWLi1+k1nuezo168wBCjRDHMQ0E4Pps5qfbYsJRgQqm0QoQ5QjC\n3aSOphj1hKHEIj9FGMgCpoU/bpQjFSb8XdwNdq4PF/89eJdyEFHzl1F7VKJ5vqN7\ngxSkvaHS1yqHTeL1fPWHOrQSSk8kYwPXYaCUAhTlAoGBAIw+qC4QNnaG9PdxUlEI\nNtOJxtTsOaDk7qjCS5lvBJ5MAFV4DoJiIEMeuB5bUqDkYARZtOwkG1aqpawa47pn\nJ7hRylbe9+PRL0hzW/HLYLYq8/erW7nD3lzIiZC7UqIbEDrMiZnHPzMGEwUzYVkF\nD9FQ/cediIDc3zhCoyAqbB4P\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-cqqy7@zenblog-8e899.iam.gserviceaccount.com",
    "client_id": "113722059226067063350",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-cqqy7%40zenblog-8e899.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }),
  storageBucket: "zenblog-8e899.appspot.com",
});
const storage = admin.storage().bucket();
const corsOptions = {
    origin: 'https://zenblogar.vercel.app',
    credentials: true, // Enable credentials (cookies)
  };
  
  app.use(cors(corsOptions));
  
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))

const salt = bcrypt.genSaltSync(10);

const secret = "sQNjfEnf4dxNvYqc4qd5dz45";

mongoose.connect("mongodb+srv://abdo:oU1EuzHLlzlMW47q@cluster0.2vojdpr.mongodb.net/?retryWrites=true&w=majority");

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});


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