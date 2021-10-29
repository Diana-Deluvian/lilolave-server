const express = require('express')
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const cors = require('cors');

app.use(express.json()); //Used to parse JSON bodies

app.use(cors());


const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://" + process.env.DB_USERNAME 
+ ":" + process.env.DB_PASSWORD 
+ "@personal-data.telw9.mongodb.net/lilolave?retryWrites=true&w=majority", {
  useNewUrlParser: true
});


const connection = mongoose.connection;

connection.once("open", function() {
    console.log("Connection with MongoDB was successful");
  });

const Post = require('./model');

let post = {
    title: "yolo",
    contents: ["yolo1", "yolo2"]
}


app.get('/', (req, res) => {    
  res.send('Hello World!')
});

app.get('/getPosts', (req, res) => {
  Post.find({}, (err, posts) =>{
  if(err) return handleError(err)
  res.send(posts)   
  });
  //res.send(posts)
})

app.post('/postPost', (req, res) => {    
    Post.create(req.body, function (err, post) {
        if (err) return handleError(err);
        console.log(post)
        res.send(post);
      });
});

app.delete('/deletePost/:id', (req, res) => {
  const query = { "_id": req.params.id };
  Post.deleteOne(query)
  .then(result => console.log(`Deleted ${result.deletedCount} item.`))
  .catch(err => console.error(`Delete failed with error: ${err}`))
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
