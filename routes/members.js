const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
module.exports=router;

//load member model
require('../models/Member');
const Member=mongoose.model('members');

//members index page
router.get('/', (req,res) =>{
  Member.find({})
  .sort({date : 'desc'})
  .then(members => {
    res.render('./members/index', {
      members:members
    });
  });
});

//add members form
router.get('/add', (req,res) => {
  res.render('./members/add');
});

//add member to data base 
router.post('/', (req,res) => {
  const newMember={
    name:req.body.name,
    addedby:req.body.addedby,
    status:req.body.status,
    password:req.body.password
  }
  new Member(newMember)
  .save()
  .then(Member => {
    res.redirect('/members');
  });
});

//goto selected id and render edit form members
router.get('/edit/:id', (req,res) => {
  Member.findOne({
    _id: req.params.id
  })
  .then(member => {
    res.render('./members/edit', {
      member:member
    });
  });
});

router.put('/:id', (req,res) => {
  Member.findOne({_id:req.params.id})
  .then(member=>{
      //new values
      member.name=req.body.name;
      member.status=req.body.status;
      member.save()
      .then(activity => {
        res.redirect('/members');
      });
  });
});

//delete idea
router.delete('/:id', (req, res) =>{
  Member.remove({_id:req.params.id})
  .then(() =>{
    res.redirect('/members');
  });
});