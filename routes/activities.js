const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');
const fileUpload= require('express-fileupload');
const path=require('path');


module.exports = router;

//load activities model
require('../models/Activity');
const Activity = mongoose.model('activities');

//middleware for file upload
router.use(fileUpload());


//activities index page
router.get('/',ensureAuthenticated, (req, res) => {
  Activity.find({user: req.user.id})
    .sort({ date: 'desc' })
    .then(activities => {
      res.render('./activities/index', {
        activities: activities
      });
    });
});

//activities view page
router.get('/view', (req, res) =>{
  Activity.find({})
  .sort({date: 'desc'})
  .then(activities =>{
    res.render('./activities/view', {activities: activities});
  });
});

//add activities form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('./activities/add');
});

//process activities form : add to database
router.post('/', ensureAuthenticated, (req, res) => {
  const newActivity = {
    name: req.body.name,
    description: req.body.description,
    details: req.body.details,
    user:req.user.id,
    username:req.user.name,
    email:req.user.email
  }
  new Activity(newActivity)
    .save()
    .then(Activity => {
      //res.redirect('/activities');
      res.render('./activities/uploadimg',{name:newActivity.name});
    });
});

//goto selected ID and render edit form -> page for activity
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Activity.findOne({
    _id: req.params.id
  })
  .then(activity =>{
    if(activity.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/activies');
    }else{
      res.render('./activities/edit', {
        activity:activity
      });
    }    
  });
});

//get form values and update database
router.put('/:id', ensureAuthenticated, (req,res) => {
  Activity.findOne({
    _id:req.params.id
  })
  .then(activity => {
    //new values
    activity.name=req.body.name;
    activity.description=req.body.description;
    activity.details=req.body.details;
    activity.user=req.user.id;
    activity.username=req.user.name;
    activity.email=req.user.email;
    //save with new data
    activity.save()
    .then(activity => {
      //res.redirect('/activities');
      res.render('./activities/uploadimg',{name:activity.name});
    })
    .catch(err);
  });
});

//delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Activity.remove({_id:req.params.id})
  .then(()=>{
    res.redirect('/activities');
  });
});

//go to detailed project
router.get('/detail/:id', (req, res) => {
  Activity.findOne({_id:req.params.id})
  .then(activity =>{    
    const path="/img/"+activity.name+".jpg";
    res.render('./activities/detail',{activity:activity, path:path});
  });
});


//upload image
router.post("/upload/:name", ensureAuthenticated, (req, res) => {
  act_name=req.params.name;
  if(!req.files){
    res.redirect('../view');
  }else{
    const file=req.files.file;
    const extension=path.extname(file.name);
    if(extension !== '.png' && extension !== '.gif' && extension !== '.jpg'){
      res.redirect('../view');
    }else{
      file.mv(__dirname+'../../public/img/'+act_name+'.jpg', function(err){
        if(err){
          //res.status(500).send(err);
          res.redirect('../view');
        }else{
          res.redirect('../view');
        }
      });
    }
  }
});