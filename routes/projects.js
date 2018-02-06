const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

module.exports=router;

//load projects model
require('../models/Project');
const Project=mongoose.model('projects');

//projects view page
router.get('/view', (req,res)=>{
  Project.find({})
  .sort({date : 'desc'})
  .then(projects => {
    res.render('./projects/view',{
      projects:projects
    });
  });
});

//projects add page
router.get('/view', ensureAuthenticated, (req,res)=>{
  Project.find({})
  .sort({date : 'desc'})
  .then(projects => {
    res.render('./projects/view',{
      projects:projects
    });
  });
});
