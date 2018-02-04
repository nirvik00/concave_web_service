const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require('passport');


//load user model
require('../models/User');
const User=mongoose.model('users');

router.get('/login', (req,res) => {
  res.render('users/login');
});

router.get('/register', (req,res) => {
  res.render('users/register');
});

//login form post
router.post('/login', (req,res, next) => {
 passport.authenticate('local',{
  successRedirect:'/activities',
  failureRedirect:'/users/login'
 })(req, res, next);
});

//register form post
router.post('/register', (req, res) =>{
  let errors=[];
  if(req.body.password!=req.body.password2){
    errors.push({text:"passwords do not match"});
  }
  if(req.body.password.length<4){
    errors.push({text:"passwords must be at least 4 characters"});
  }
  if(errors.length>0){
    res.render('users/register', {
      errors:errors,
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      password:req.body.password2
    });
  }else{
    User.findOne({email: req.body.email})
    .then(user => {
      if(user){
        errors.push({text:"email already exists"});
        res.redirect('/users/register');
      }else{
        const newUser=new User({
          name:req.body.name,
          email:req.body.email,
          password:req.body.password
        });
        bcrypt.genSalt(10, (err, salt) =>{
          bcrypt.hash(newUser.password, salt, (err, hash) =>{
            if(err) throw err;
            newUser.password=hash;
            newUser.save()
            .then(user => {
              res.redirect('/users/login');
            })
          });
        });
      }
    });
  }
});

//logout user
router.get('/logout', (req, res) =>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


//export the module
module.exports=router;