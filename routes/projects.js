const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');
const fileUpload= require('express-fileupload');
const path=require('path');


module.exports = router;

//load projects model
require('../models/Project');
const Project = mongoose.model('projects');

//middleware for file upload
router.use(fileUpload());

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
router.post("/upload/:name", ensureAuthenticated, (req, res) => {
  proj_name=req.params.name;
  if(!req.files){
    res.redirect('../view');
  }else{
    const file=req.files.file;
    const extension=path.extname(file.name);
    if(extension !== '.png' && extension !== '.gif' && extension !== '.jpg'){
      res.redirect('../view');
    }else{
      file.mv(__dirname+'../../public/img/'+proj_name+'.jpg', function(err){
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
      //res.redirect('./upload')
      res.render('./projects/uploadimg',{projname:newProject.projname});
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
      res.render('./projects/uploadimg',{projname:project.projname});
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
    name=project.projname;
    //const filepath=__dirname+'../../uploads/'+name+'.jpg';
    const path="/img/"+project.projname+".jpg";
    res.render('./projects/detail',{project:project, path:path,});
  });
});
