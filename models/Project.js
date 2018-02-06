const mongoose=require("mongoose");
const Schema=mongoose.Schema;

//create Schema
const ProjectSchema=new Schema({
  name:{
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
  date:{
    type:Date,
    default:Date.now
  }
});

mongoose.model('projects', ProjectSchema);