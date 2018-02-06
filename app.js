const express = require('express');
const exhbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path=require('path');
const flash=require('connect-flash');
const passport=require('passport');
const session=require('express-session')
const mongoose = require('mongoose');

const app = express();

mongoose.Promise=global.Promise;

//DB config
const db=require('./config/database');

//connect to database
// local or production ? =
mongoose.connect(db.mongoURI, {
  //useMongoClient:true
})
.then(() => console.log('mongodb connected...'))
.catch(err => console.log(err));

//passsport Config
require ('./config/passport')(passport);

//load routes
const activities=require('./routes/activities');
const members=require('./routes/members');
const users=require('./routes/users');


//load middleware
//express-handlebars : views
app.engine('handlebars', exhbs({
defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

//body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//method-override
app.use(methodOverride('_method'));

// express-session middleware
app.use(session({
  secret:'secret',
  resave:true,
  saveUninitialized:true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect-flash
app.use(flash());

//Global Variables
app.use(function(req, res, next){
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  res.locals.user=req.user || null;
  next();
});

//this is the landing page : index
app.get('/',(req,res) => {
  title="Concave"
  res.render('index', {title:title});
});

//this is the about page : about
app.get('/about', (req,res) => {
  res.render('about');
});

//use routes
app.use('/activities', activities);
app.use('/members', members);
app.use('/users', users);

//start server on port heroku or locally at 3000 
const port=process.env.PORT || 3000;
app.listen(port, ()=>{
  console.log('server started on port ${port}');
});

 