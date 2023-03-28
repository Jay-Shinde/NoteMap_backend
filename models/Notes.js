const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  //   title:  String, // String is shorthand for {type: String}
  //   author: String,
  //   body:   String,
  //   comments: [{ body: String, date: Date }],
  //   date: { type: Date, default: Date.now },
  //   hidden: Boolean,
  //   meta: {
  //     votes: Number,
  //     favs:  Number
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'users'
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,

    default: "general",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("notes", NotesSchema);
