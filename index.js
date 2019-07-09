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

app.get('/api/posts', (req, res) => {
    Posts.find()
    .then(post => {
        res.status(200).json(post)
    })
    .catch(() => {
        res.status(500).json({
            error: "The posts information could not be retrieved." 
        })
    })
})


app.get('/api/posts/:id', async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id);
  
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist."});
      }
    } catch (error) {
      res.status(500).json({
        error: "The post information could not be retrieved." 
      });
    }
  });
  



app.listen(3000, () => console.log("listening on port 3000"))