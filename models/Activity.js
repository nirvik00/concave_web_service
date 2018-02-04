const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ActivitySchema = new Schema({
  name:{
    type:String,
    required:true
  },
  createdby:{
    type:String,
    required:true
  },
  details:{
    type:String,
    required:true
  },
  user:{
    type:String,
    required: true
  },
  date:{
    type:Date,
    default:Date.now
  }
});

mongoose.model('activities', ActivitySchema);