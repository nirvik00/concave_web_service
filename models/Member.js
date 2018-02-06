const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const MemberSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true
  },
  addedby:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    default:Date.now
  }
});

mongoose.model('members', MemberSchema);