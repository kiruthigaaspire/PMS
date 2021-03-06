/*require decelerations*/
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
var multer  =   require('multer');
var simple_git = require('simple-git')("repo_clones/");
var mkdirp = require('mkdirp');
var createFile = require('create-file');
var fs = require("fs"),
path = require("path");
var apiRoutes = express.Router(); 
var async = require('async');

 /*Envirnoment Setup*/
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable
projectModel = new project_model();
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
app.use(express.static('../client'));
/*End of Envirnoment Setup*/


/*Code For all the http requests*/
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
  var opts = {
  scope: 'base',
  attributes: ['cn','dn','ou'],
  filter:'(&(sAMAccountName=v))',
  //paging: true,
  };
/*client.search('dc=aspiresys,dc=com',opts, function(err, res) {
  if(err){
    console.log("Error in search "+err);
  }
    else{
      console.log(res);
  res.on('searchEntry', function(entry) {
    console.log(entry);
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
});
*///filter = "(&(sAMAccountName=$username))"
       
//End of the authentication method
});


//...create porject function to add the project in database and initiate the repo..//
apiRoutes.post('/projects', function(req, res) {

  projectModel.aspireProjectName = req.body.aspireProjectName;
  projectModel.projectName = req.body.projectName;
  projectModel.projectManagers = req.body.projectManagers;
  projectModel.gitRepo = req.body.gitRepo;
  var aspireProjectName = req.body.aspireProjectName;
  var url = "git+ssh://git@github.com/AmeyaShukla/"+aspireProjectName+".git" ;

  simple_git.clone(url, './'+aspireProjectName+'/',function(err){
  if(err)
  console.log("Clone Failed"+err);
else
{
  console.log("Clone success");
  mkdirp('./repo_clones/'+aspireProjectName+'/spec_doc1', function (err) {
    if (err) console.error(err)
    else {
      console.log("dir created");
      addFile();
      
    }
  });
}
});
var addFile = function(){
 createFile('./repo_clones/'+aspireProjectName+'/spec_doc1/default', 'initiate file', function (err) {
  if(err)
    console.log("Error in creating file");
  else
    {console.log("file created");
  pushData();
}
});
};
var simple_git1 = require('simple-git')("repo_clones/"+aspireProjectName+"/");
var pushData = function(){
simple_git1
          .add('--all')
         .commit("first commit!")
          .addRemote('mytest1', url)
         .push('mytest1','master',function(err){
          if(err)
            console.log("Some Error"+err);
          else
            console.log("push Success");
            addToDatabase();
         })
};


//...Add the data into database...//
var addToDatabase = function(){

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
//...End of addToDatabase function...//
}
//...End of the create project function...//
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

apiRoutes.post('/createFolder/',function(req,res){

    var address = req.body.address;
    console.log(address);
    mkdirp('./repo_clones/'+address, function (err) {
    if (err) console.error(err)
    else {
      console.log("dir created");
      addFile();
      
    }
  });
    var aspireProjectName = req.body.gitRepo ;
var url = "git+ssh://git@github.com/AmeyaShukla/"+aspireProjectName+".git" ;
  var  addFile = function(){
 createFile('./repo_clones/'+address+"/default", 'initiate file', function (err) {
  if(err)
    console.log("Error in creating file");
  else
    {console.log("file created");
  pushData();
}
});
};
var simple_git1 = require('simple-git')("repo_clones/"+aspireProjectName+"/");
var pushData = function(){
simple_git1
          .add('--all')
          .commit("first commit!")
          //.addRemote('mytest1', url)
         .push('mytest1','master',function(err){
          if(err)
            console.log("Some Error"+err);
          else
            console.log("push Success");
           
         })
         
};

})



/*function for getting the project Code*/
apiRoutes.get('/projectCode/:aspireProjectName', function(req, res) {

var aspireProjectName = req.params.aspireProjectName;
console.log(aspireProjectName);
var url = "git+ssh://git@github.com/AmeyaShukla/"+aspireProjectName+".git" ;
var simple_git1 = require('simple-git')("repo_clones/"+aspireProjectName+"/");

simple_git1
         
         .pull('mytest1','master',function(err){
          if(err){
            console.log("Some Error"+err);
          }
          else{
          var fileStructure = [],i=0;
          var p = "./repo_clones/"+aspireProjectName+"/";
          fs.readdir(p, function (err, files) {
              if (err) {
                  throw err;
              }
              files.map(function (file) {
                  return path.join(p, file);
              }).filter(function (file) {
                  if(fs.statSync(file).isFile()){
                     var data = {'name':path.basename(file),isFile:true,address:file,time:fs.statSync(file).mtime};
                    fileStructure[i] = data;
                    i++;
                  }
                  else{
                    var data = {'name':path.basename(file),isFile:false,address:file};
                    fileStructure[i] = data;
                    i++;
                  }
              })
           
          console.log(fileStructure);
          res.json({success:true,fileStructure:fileStructure});
          });
          
         }
         })  

/*End for getting the project code */
});

/*function for getting the subfolder files*/
apiRoutes.post('/download/', function(req, res) {

          var fileStructure = [],i=0;
          var p = "./"+req.body.address+"/";
          fs.readdir(p, function (err, files) {
              if (err) {
                  throw err;
              }
              files.map(function (file) {
                  return path.join(p, file);
              }).filter(function (file) {
                  if(fs.statSync(file).isFile()){
                     var data = {'name':path.basename(file),isFile:true,address:file,time:fs.statSync(file).mtime};
                    fileStructure[i] = data;
                    i++;
                  }
                  else{
                    var data = {'name':path.basename(file),isFile:false,address:file};
                    fileStructure[i] = data;
                    i++;
                  }
              })
           
          console.log(fileStructure);
          res.json({success:true,fileStructure:fileStructure});
          });




});

/*function for getting the list of all project*/
apiRoutes.get('/projects', function(req, res) {
  //view_module.likeProfile(req,res);
  project_model.find({}, function(err,user){
      if(err)
            res.json({success:false,message:err});
          else
            res.json({success:true,user:user})
  });

});

/*function for editing the project Detais*/
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
  doc.customField = req.body.customField;

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
 var error=false; 
  console.log(req.body[0].aspireProjectName);
      if(req.body[0].aspireProjectName === 'master'){
          project_model.find({}, function(err,user){


for (var i in user) {
  aspireProjectName = user[i].aspireProjectName;
        project_model.update({aspireProjectName:aspireProjectName },{ $push: { 'customField':req.body[0] } }, {upsert:true},function(err,data) {
      if (err) {
        error = true;
      
      }
      else {
        error =false;
         success = true;
      } 

    });
        }
          });

         if(error)
         {
          res.json({success:false,message:"Custom Field Failed"});
         }
         else
         {
          res.json({success:true,message:"Field Added Successfully"});
         }

      }
        else
        {
      project_model.update({aspireProjectName: req.body[0].aspireProjectName },{ $push: { 'customField':req.body[0] } }, {upsert:true},function(err,data) {
      if (err) {
        res.json({success:false,message:'Some Error'+err} );
      }
      else {
        console.log("The data is"+data);
       res.json({success:true,message:'Custom Field Added Successfully'});
      } 

    });
}
//End of the add custom field
});
  var upload = function(req,res,err){
   console.log(req)
  }

    /** API path that will upload the files */
    apiRoutes.post('/upload', function(req, res) {

      upload(req,res,function(err){
        console.log("asdfs"+req.body.uploadPath);
        /*  folderPath = './repo_clones/'+req.body.uploadPath+'/';
          console.log("upload called Th path is "+JSON.stringify(req.body.uploadPath));
          
        */
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        })
    });

/* var storage = multer.diskStorage({ //multers disk storage settings
          destination: function (req, file, cb) {
            cb(null, folderPath)
          },
          filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null,file.originalname)
        }
    });
    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');*/
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




    
app.use('/myapi', apiRoutes);
app.listen(8080);
console.log("App listening on port 8080");