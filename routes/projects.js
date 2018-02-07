const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

module.exports = router;

//load projects model
require('../models/Project');
const Project = mongoose.model('projects');

//projects view page as general login
router.get('/view', (req, res) => {
  Project.find({})
    .sort({ date: 'desc' })
    .then(projects => {
      res.render('./projects/view', {
        projects: projects
      });
    });
});

//projects add form page
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('./projects/add', {
  });
});

//upload image
router.post("/upload", (req, res) => {
  if(!req.files){
    res.send("No files uploaded");
  }else{
    const file=req.files.file;
    console.log(req);
    const extension=path.extname(file.name);
    if(extension !== '.png' && extension !== '.gif' && extension !== '.jpg'){
      res.send("Only images are allowed");
    }else{
      const filepath=__dirname+"/uploads/"+file.name;
      file.mv(__dirname+"/uploads/"+file.name, function(err){
        if(err){
          res.status(500).send(err);
        }else{
          res.send(name+ " file uploaded");
        }
      });
    }
  }
})
//process projects form : add to database
router.post('/', ensureAuthenticated, (req, res) => {
  useremail0 = req.user.email;
  username0 = req.user.name;
  const newProject = {
    projname: req.body.projname,
    description: req.body.projdesc,
    details: req.body.projdetails,
    username: username0,
    email: useremail0,
    user: req.user.id
  }
  new Project(newProject)
    .save()
    .then(Project => {
      res.redirect('./projects/view')
    });
});

//goto my index projects page to edit 
router.get('/edit', ensureAuthenticated, (req, res) => {
  Project.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(projects => {
      res.render('./projects/index', {
        projects: projects
      });
    });
});

//goto selected ID and render edit form -> page for projects
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Project.findOne({
    _id: req.params.id
  })
    .then(project => {
      if(project.user != req.user.id){
        req.flash('error_msg', 'Not Authorized');
      res.redirect('./projects/view');
      }else{
        res.render('./projects/edit', {
          project:project
        });
      }
    });
});

//get form values and update database
router.put('/:id', ensureAuthenticated, (req, res) => {
  Project.findOne({
    _id:req.params.id
  })
  .then(project =>{
    //new values
    project.projname=req.body.projname;
    project.description=req.body.description;
    project.details=req.body.details;
    project.username=req.user.name;
    project.email=req.user.email;
    project.user=req.user.id;
    //save with new data
    project.save()
    .then(project =>{
      res.redirect('/projects/edit');
    })        
  });
});

//delete project
router.delete('/:id', ensureAuthenticated, (req, res) =>{
  Project.remove({_id:req.params.id})
  .then(() => {
    res.redirect('/projects/edit');
  })
})


//go to detailed project
router.get('/detail/:id', (req, res) => {
  Project.findOne({_id:req.params.id})
  .then(project =>{    
    res.render('./projects/detail',{project:project});
  });
});


