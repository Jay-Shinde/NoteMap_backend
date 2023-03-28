const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsersSchema = new Schema({
//   title:  String, // String is shorthand for {type: String}
//   author: String,
//   body:   String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   meta: {
//     votes: Number,
//     favs:  Number
name:{
    type: String,
    required: true
},
email:{

    type: String,
    required: true,
    unique: true
    
},
password:{
    type: String,
    required: true
},
date:{
    type: Date,
    default: Date.now
}

  
});

module.exports = mongoose.model('users', UsersSchema)