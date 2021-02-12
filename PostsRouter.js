const express = require('express');
const router = express.Router();

router.use(express.json())

const Posts = require('./data/db');




router.post('/', async (req, res) => {
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

router.get('/', (req, res) => {
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


router.get('/:id', async (req, res) => {
    try {
      const post = await Posts.findById(req.params.id);
  
      if (post.length === 1) {
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

  router.get('/:id/comments', (req, res) => {
    getPost(req.params.id)
    .then(() => {
        Posts.findPostComments(req.params.id)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json({ error: "The comments information could not be retrieved." });
        })
    })
    .catch(error => {
        res.status(404).json({ error: "The post with the specified ID does not exist." });
    })
})

router.post('/:id/comments', (req, res) => {
    if(!req.body.text) {
        res.status(400).json({ error: "Please provide text for the comment." });
        return;
    }
    getPost(req.params.id)
    .then(() => {
        const comment = {...req.body, post_id: req.params.id};
        Posts.insertComment(comment)
        .then(data => {
            Posts.findCommentById(data.id)
            .then(dbComment => {
                res.status(201).json(dbComment);
            })
            .catch(error => {
                throw new Error("Error adding comment");
            })
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the comment to the database" });
        })
    })
    .catch(error => {
        res.status(404).json({ error: "The post with the specified ID does not exist." });
    })
})



  router.delete('/:id', (req, res) => {
    const { id } = req.params
  
    Posts.remove(id)
      .then(post => {
       
        if (post) {
          res.status(200).json({ message: 'The post was successfully deleted' })
        } else {
          res
            .status(404)
            .json({ message: 'The post with the specified ID does not exist.' })
        }
      })
      .catch(() =>
        res.status(500).json({ error: 'The post could not be removed' })
      )
  })
  
  router.put('/:id', (req, res) => {
    const { id } = req.params
    const post = req.body
  
    if (post.title && post.contents) {
      Posts.update(id, post)
        .then(post => {
          if (post === 1) {
            Posts.findById(id)
            .then(post => res.status(200).json(post))
          } else {
            res
              .status(404)
              .json({ message: 'The post with the specified ID does not exist.' })
          }
        })
        .catch(() =>
          res
            .status(500)
            .json({ error: 'The post information could not be modified.' })
        )
    } else {
      res
        .status(400)
        .json({ errorMessage: 'Please provide title and contents for the post.' })
    }
  })

module.exports = router;