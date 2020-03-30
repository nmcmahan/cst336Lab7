const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js

const request = require('request');

//routes
app.get("/", async function(req, res){
    
    
    let keywords = ["cats", "dogs", "otter", "college"];
    let keyselect = Math.floor(Math.random() * 4);
 let parsedData = await getImages(keywords[keyselect]);
 
 console.dir("parsedData: " + parsedData); //displays content of the object

    let randIndex1 = Math.floor(Math.random() * parsedData.hits.length);
    let randIndex2 = Math.floor(Math.random() * parsedData.hits.length);
    let randIndex3 = Math.floor(Math.random() * parsedData.hits.length);
    let randIndex4 = Math.floor(Math.random() * parsedData.hits.length);
    res.render("index", 
    {"image0":parsedData.hits[randIndex1].largeImageURL, 
    "image1":parsedData.hits[randIndex2].largeImageURL, 
    "image2":parsedData.hits[randIndex3].largeImageURL, 
    "image3":parsedData.hits[randIndex4].largeImageURL, 
    "likes0":parsedData.hits[randIndex1].likes, 
    "likes1":parsedData.hits[randIndex2].likes, 
    "likes2":parsedData.hits[randIndex3].likes, 
    "likes3":parsedData.hits[randIndex4].likes});
    
 
            
}); //root route


app.get("/results", async function(req, res){
    
    //console.dir(req);
    let keyword = req.query.keyword; //gets the value that the user typed in the form using the GET method
    let orientation = req.query.orientation;
    console.log(orientation);
    
    let parsedData = await getImages(keyword, orientation);

    res.render("results", {"images":parsedData});
    
});//results route


//Returns all data from the Pixabay API as JSON format
function getImages(keyword, orientation){
    
    
    return new Promise( function(resolve, reject){
        request('https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&q='+keyword+"&orientation="+orientation,
                 function (error, response, body) {
    
            if (!error && response.statusCode == 200  ) { //no issues in the request
                
                 let parsedData = JSON.parse(body); //converts string to JSON
                 
                 resolve(parsedData);
                
                //let randomIndex = Math.floor(Math.random() * parsedData.hits.length);
                //res.send(`<img src='${parsedData.hits[randomIndex].largeImageURL}'>`);
                //res.render("index", {"image":parsedData.hits[randomIndex].largeImageURL});
                
            } else {
                reject(error);
                console.log(response.statusCode);
                console.log(error);
            }
    
          });//request
   
    });
    
}


//starting server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Express server is running...");
});