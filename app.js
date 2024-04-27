const app=require("express")();
const http=require("http").Server(app);
const path = require('path');
var express=require("express");
var bodyParser=require("body-parser");

const mongoose = require('mongoose');
mongoose.connect("<url>");
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
const { MongoClient } = require("mongodb");
const uri ="<url>";
const client = new MongoClient(uri);
db.once('open', function(callback){
	console.log("connection succeeded");
})

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));

app.listen(3000,(req,res)=>{
  app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'home.html') )
  })
  app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'login.html') )
  })
  app.post('/submit',async function(req,res){
        await client.connect();
        const database = client.db('test');
        const collections = database.collection('users');
        const query = req.body;
        const tf = collections.findOne(query);
        const original = collections.find({});
        console.log(tf,original);
        if (tf){
          res.sendFile(path.join(__dirname,'success.html') )
        }else{
          res.sendFile(path.join(__dirname,'home.html') )
        }
    })
  app.post('/sign_up', function(req,res){
      var name = req.body.name;
      var pass = req.body.password;
    
      var data = {
        "name": name,
        "password":pass,
      }
    db.collection('users').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
          
      });
        
    res.sendFile(path.join(__dirname,'signup_success.html') )
    })
  app.get('/success',(req,res)=>{
    res.sendFile(path.join(__dirname,'success.html') )
  })
  app.get('/sign',(req,res)=>{
    res.sendFile(path.join(__dirname,'sign.html') )
  })
})
