const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  category: String,
  title: String,
  contents: [String],
  references: [String],
  date: String,
  personalNotes: [String],
  additionalInfos: [String],
  keywords: [String],
  hidden: Boolean,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
