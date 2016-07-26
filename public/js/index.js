
var lat="";
var lon="";


// initial_functions will call all the functions that are to be called onloading the page

function initial_functions() {
    Get_geo_graphical_Location();
    
}

//this function will get the geolocation of the user

function Get_geo_graphical_Location(){

    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition,getError);

    }
    else
    {
        Get_Weather_Detials("23.18","79.98");

    }
}

//this is function is called if the permission is denied for tracking the location ,developers location details will be used

function getError(error)
{
    if(error.code==error.PERMISSION_DENIED)
    {
        alert("i cant get your location");
        Get_Weather_Detials("40.7","-74");
    }
}

//This function will get the geolocation and call the function which make call to the weather api and display the data 

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    if (lat == "" && lon == "") {

    }
    else {
        Get_Weather_Detials(lat, lon);
    }
}

function Get_Weather_Detials(lat,lon)
{


    var xhr;
//create a XML request according to the web browser..
    if(window.XMLHttpRequest)
    {
        xhr = new XMLHttpRequest();
    }
    else if(window.ActiveXObject)
    {
        xhr = new ActiveXObject(Microsoft.XMLHTTP);
    }
    // store the data to be sent in the variable called data
    //the api used is openweathermap.org ....visit he thier site for more details
    //the api key is = "471c4c453c085365b45d5c6a64656fa3"//
    var data="lat="+lat+"&lon="+lon+"&appid=471c4c453c085365b45d5c6a64656fa3&units=metric";
    //alert(data);
    xhr.open("POST","http://api.openweathermap.org/data/2.5/weather?"+data,true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    // send the data to the specified url..
    xhr.send();
    // display the data returned by the php script

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response_data=xhr.responseText;

            //the recieved data is in the json format and hence we need to parse it to use in javascript...

            var obj=JSON.parse(response_data);
            var current_temp=obj.main.temp;
            var current_city=obj.name;
            var current_id=obj.weather[0].id;
            var current_wh=obj.weather[0].main;
            var current_id_start=current_id.toString().substring(0,1);


            weatherDetails = "<i>"+current_temp+"&degC" + " " +current_city+"</i>";
            var currentDate = new Date();
            document.getElementById("todayDate").innerHTML =  "<i>"+currentDate.toDateString()+", "+weatherDetails+"</i>";
        }
    }

}