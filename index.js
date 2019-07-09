const express = require('express');
const app = express();
const Posts = require('./data/db');

app.use(express.json());

app.post('/api/posts', async (req, res) => {
    const payload = {...req.body}
    try {
        if(req.body.contents && req.body.title){
           const newPost = await Posts.insert(payload)
            res.status(201).json(newPost)
        } else {
            res.status(400).json({
                errorMessage: "Please provide title and contents for the post." 
            })
        }
    }catch(error){
            res.status(500).json({
                error: "There was an error while saving the post to the database"
            })
    }

})





app.listen(3000, () => console.log("listening on port 3000"))