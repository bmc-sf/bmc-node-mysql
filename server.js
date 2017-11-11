//	Web Service Update MySQL DB
//	Usage:
//			command prompt
//			run 'node app.js'
//			Console will print message
//			Open URL in Browser to see message
//  Version:  app.js.v3_good

//Imports
var express = require("express");
var mysql = require('mysql');
//var parse = require('utils-json-parse');
var http = require('http');
var bodyParser = require('body-parser');

// Use Express
var app = express()

// Use body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MySQL DB Parameters
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "admin",
	  password: "admin",
	  database: "students"
	});
// connect to DB
    con.connect(function(err) {
        if (err) {
            console.error('Error:- ' + err.stack);
            return;
        }
     
        console.log('Connected Id:- ' + con.threadId);
    });

// ------------------------------------------------
// Express
// ------------------------------------------------
// GET request returns static text
//app.get('/', (req, res) => res.send('Hello......node.js server'));
app.get('/', function (req, res){
	res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>node.js DB app</h1><br /><br /> <strong>View All students:  </strong><a href="http:\/\/localhost:8080\/students">http:\/\/localhost:8080\/students</a></br><strong>View Harry:  </strong><a href="http:\/\/localhost:8080\/harry">http:\/\/localhost:8080\/harry</a></br><strong>Insert Student:  </strong><a href="http:\/\/localhost:8080\/insert">http:\/\/localhost:8080\/insert</a></br><strong>Update Student Paid:  </strong><a href="http:\/\/localhost:8080\/update">http:\/\/localhost:8080\/update</a></br> <strong>Update Student Free:  </strong><a href="http:\/\/localhost:8080\/update2">http:\/\/localhost:8080\/update2</a></br><strong>Delete Student:  </strong><a href="http:\/\/localhost:8080\/delete">http:\/\/localhost:8080\/delete</a></br>');    
    res.end();
});

// GET request runs SELECT * query
app.get('/students', function(request, response) {
	con.query("SELECT * FROM students", function (err, result, fields) {
		if (err) throw err;
        console.log("Results:");
 		console.log(result);
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(JSON.stringify(result));
		response.end();
	  });
});

// GET request runs SELECT * query
app.get('/harry', function(request, response) {
	con.query("SELECT * FROM students WHERE lastname = 'Potter'", function (err, result, fields) {
		if (err) throw err;
        console.log("Results:");
 		console.log(result);
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(JSON.stringify(result));
		response.end();
	  });
});

// GET request runs INSERT query
app.get('/insert', function(request, response) {
	  var sql = "INSERT INTO students (firstname, lastname, email, institution, course, instructor, subscription_type, subscription_level) VALUES ('Mace', 'Windu', 'mwindu@ral.com', 'Rebel Alliance University', 'Rebellion History Insights', 'Yoda','','')";
	  con.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
		console.log(sql);
	  });
});

// GET request runs UPDATE Paid query
app.get('/update', function(request, response) {
	  var value1 = '2';
	  var value2 = '3';
	  var sql = "UPDATE students SET subscription_type = 'Paid', subscription_level = 'Best' WHERE lastname = 'Granger'";
	  con.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
		console.log(sql);
	  });
	  
});

// GET request runs UPDATE Free query
app.get('/update2', function(request, response) {
    var value1 = '2';
    var value2 = '3';
    var sql = "UPDATE students SET subscription_type = 'Free', subscription_level = 'Good' WHERE lastname = 'Granger'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      console.log(sql);
    });
    
});

// GET request runs DELETE query
app.get('/delete', function(request, response) {
	   var sql = "DELETE FROM students WHERE lastname like '%Windu%'";
	  con.query(sql, function (err, result) {
		if (err) throw err;
		console.log("1 record inserted");
        console.log(sql);
        response.write('Deleted student Mace Windu');
	  });
});

// Handle POST with JSON
app.post('/json', function(request, response) {
    var jsonData = request.body;

    // var myStringResult = JSON.stringify(request.body);
    // var myResult = JSON.parse(myStringResult);
    // firstname = myResult.firstname;
    // lastname = myResult.lastname;
    var jString = JSON.stringify(jsonData);
    var jObj = JSON.parse(jString);
    var tmp = 'New Student:  ' + jObj.firstname + ' ' + jObj.lastname + ' ' + jObj.email;
    console.log('JSON = ' + tmp);

    // Update Student
    var sql = "UPDATE students SET subscription_type = '"+jObj.subscription_type+"', subscription_level = '"+jObj.subscription_level+"' WHERE lastname = '"+jObj.lastname+"'";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      
    });
    
    // Write Response
    response.set('Content-Type', 'application/json');
    response.write("You sent some data " + JSON.stringify(jsonData));
    response.end();
});

var server = app.listen(8080, function () {
	var host = server.address().address;
	var port = server.address().port;

 //Print Message To Console
 console.log('Server running at http://%s:%s', host, port);
});