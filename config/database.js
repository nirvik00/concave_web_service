if(process.env.NODE_ENV==='production'){
  module.exports={mongoURI:'mongodb://nirvik:Nirvik0112358@ds123698.mlab.com:23698/concave-prod'}
}else{
  module.exports={mongoURI:'mongodb://localhost/concave-dev'}
}