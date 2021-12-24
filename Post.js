const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  category: String,
  title: String,
  content: String,
  date: String,
  personalNotes: String,
  otherInfo: String,
  keywords: String,
  hidden: Boolean,
    pinned: Boolean,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
