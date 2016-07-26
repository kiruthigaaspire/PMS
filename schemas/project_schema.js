

var mongoose = require('mongoose');
var Schema=mongoose.Schema;


var projectManagers = new Schema({
      pmName : String,			//PM name
      pmId : String 			//PM Id
  });


var teamMembers = new Schema({
      memberName : String,			//member name
      memberId : String 			//member Id
  });

var fieldValue = new Schema({
      value : String,
  });


var customField = new Schema({
      aspireProjectName : String,
      fieldType : String,      //field Type
      fieldName : String,   //field name
      fieldTitle : String, //field title
      fieldValue : [fieldValue],
      isOption : {type : String,default : false},

  });

var projectSchema= new Schema({

    aspireProjectName : {type : String , required : true}, //Aspire Project Name
    projectCode : {type : String}, // project code
    projectName : {type : String }, // project name
    projectManagers : [projectManagers], //list of project managers
    teamMembers : [teamMembers], //list of team members
    clientName : {type : String}, //client name
    projectDescription : {type : String},
    gitRepo : {type : String}, //address for the git repo
    customField : [customField],
    projectOwner : String,
    accountManager : String,
    startDate : Date,
    endDate : Date,
    
});



var project_model = mongoose.model('projects',projectSchema);

module.exports=project_model;

