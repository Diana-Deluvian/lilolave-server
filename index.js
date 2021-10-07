const express = require('express')
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

const mongoose = require("mongoose");
console.log(process.env.DB_USERNAME);
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
})

app.post('/postPost', (req, res) => {
    console.log(req.body);
    Post.create(req.body, function (err, post) {
        if (err) return handleError(err);
        res.send(post);
      });
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
