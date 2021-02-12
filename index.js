const express = require('express');
const app = express();
const PostsRoutes = require('./PostsRouter');


app.use('/api/posts', PostsRoutes);



app.listen(3000, () => console.log("listening on port 3000"))