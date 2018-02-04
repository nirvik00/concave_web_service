if(process.env.node_env==='production'){
  module.exports={mongoURI:'mongodb://nirvik:Nirvik0112358;@ds125058.mlab.com:25058/concave-prod'}
}else{
  module.exports={mongoURI:'mongodb://localhost/concave-dev'}
}