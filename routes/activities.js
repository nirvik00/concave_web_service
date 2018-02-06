const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

module.exports = router;

//load activities model
require('../models/Activity');
const Activity = mongoose.model('activities');

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
    createdby: req.body.createdby,
    details: req.body.details,
    user:req.user.id
  }
  new Activity(newActivity)
    .save()
    .then(Activity => {
      res.redirect('/activities');
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
    activity.details=req.body.details;
    activity.createdby=req.body.createdby;
    //save with new data
    activity.save()
    .then(activity => {
      res.redirect('/activities');
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

