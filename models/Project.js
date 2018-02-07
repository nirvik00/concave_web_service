const mongoose=require("mongoose");
const Schema=mongoose.Schema;

//create Schema
const ProjectSchema=new Schema({
  projname:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  details:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  }, 
  user:{
    type:String,
    required: true
  },
  imgpath:{
    type:String
  },
  date:{
    type:Date,
    default:Date.now
  }
});

mongoose.model('projects', ProjectSchema);