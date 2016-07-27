var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongod
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var project_model=require('./schemas/project_schema.js');
var config = require('./config');
var jwt    = require('jsonwebtoken'); 
var Form = require('form-builder').Form;
var ldap = require('ldapjs');
var assert = require('assert');
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable


projectModel = new project_model();

    // configuration =================

   // mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io



app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

    // listen (start app with node server.js) ======================================
var apiRoutes = express.Router(); 

// app.get('/', function(req, res) {
//   // load the single view file (angular will handle the page changes on the front-end)
//   res.sendfile('./public/index.html');
// });

apiRoutes.post('/authenticate',function(req,res){
      
      var userName  = req.body.userName;
      var userPassword = req.body.userPassword;
    var client = ldap.createClient({
         url: 'ldap://172.24.113.1:389'
        });

      client.bind(userName,userPassword, function(err) {
        if(err){
          console.log("Error in binding the user  "+err);
          res.json({success:false,message:"Wrong Credentials"});
        }
        else{
            var token = jwt.sign(userName, app.get('superSecret'), {});
            res.json({success:true,token:token,message:"Token Sent"});
            console.log("Successfully Binded with LDAP");
        }

      });
  /*    var opts = {
  scope: 'base',
  attributes: ['cn','dn','ou'],
  filter:'(&(sAMAccountName='+userName+'))',
 // paging: true,
  
};
client.search('dc=aspiresys,dc=com,cn=System', function(err, res) {
  if(err){
    console.log("Error in search "+err);
  }
    else{
      console.log(res);
  res.on('searchEntry', function(entry) {
    console.log(entry.object);
  });
  res.on('page', function(result) {
    console.log('page end');
  });
  res.on('error', function(resErr) {
       console.log("The Response Error  "+resErr);

  });
  res.on('end', function(result) {
    console.log('done ');
  });
}
});*/
//filter = "(&(sAMAccountName=$username))"
       
//End of the authentication method
});

apiRoutes.post('/projects', function(req, res) {

  projectModel.aspireProjectName = req.body.aspireProjectName;
  projectModel.projectName = req.body.projectName;
  projectModel.projectManagers = req.body.projectManagers;

   project_model.findOne({aspireProjectName: req.body.aspireProjectName}, function(err,user){
    if(err){

      res.json({success:false,message:err});
    
    }
    else if(user){

              res.json({success:false,message:'Project Already Exist'});
    
    }
    else{
        projectModel.save(function(err,user){
            if (err) {
                console.log(err);
                res.json({success:false,message:err});
                }
                else {
                  res.json({success:true,message:'Project Added Successfully'});
                }
              });
        }
    });

});


apiRoutes.get('/projects/:aspireProjectName', function(req, res) {
  //view_module.likeProfile(req,res);
  console.log("The aspireproject name"+req.params.aspireProjectName);
  

  project_model.findOne({aspireProjectName: req.params.aspireProjectName}, function(err,user){
      if(err)
            res.json({success:false,message:err});
          else
          {
           res.json({success:true,user:user})
          }
  });


});



apiRoutes.get('/projects', function(req, res) {
  //view_module.likeProfile(req,res);
  project_model.find({}, function(err,user){
      if(err)
            res.json({success:false,message:err});
          else
            res.json({success:true,user:user})

  });
});


apiRoutes.put('/projects', function(req, res) {
  project_model.findOne({ aspireProjectName:req.body.aspireProjectName}, function (err, doc){
  doc.projectName = req.body.projectName;
  doc.clientName = req.body.clientName;
  doc.projectDescription = req.body.projectDescription;
  doc.projectManagers = req.body.projectManagers;
  doc.teamMembers = req.body.teamMembers;
  doc.projectOwner = req.body.projectOwner;
  doc.accountManager  = req.body.accountManager;
  doc.startDate  = req.body.startDate;
  doc.endDate = req.body.endDate;
  doc.save(function(err,project){
    if(err)
    {
      res.json({success:true,message:err});
    }
    else
    {
      res.json({success:true,message:"update success"});
    }
  });
});

});

apiRoutes.post('/addCustomField', function(req, res) {
  
  console.log(req.body[0].aspireProjectName);

      project_model.update({aspireProjectName: req.body[0].aspireProjectName },{ $push: { 'customField':req.body[0] } }, {upsert:true}, function(err,data) {
      if (err) {
        res.json({success:false,message:'Some Error'+err} );
      }
      else {
        console.log("The data is"+data);
       res.json({success:true,message:'Custom Field Added Successfully'});
      } 

    });

});

//middleware to protect the routes from unauthorised access
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret')
      , function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });
  } else {
      res.json({success:false,message: 'No token provided'});
    }
});

// Perform Like operation
apiRoutes.put('/like/:email_id', function(req, res) {
  //view_module.likeProfile(req,res);
});


    
app.use('/myapi', apiRoutes);
app.listen(8080);
console.log("App listening on port 8080");