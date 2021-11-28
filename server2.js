'use strict';

const { spawn } = require('child_process');
const lineReader = require('line-reader');
const utf8 = require('utf8');
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = "";
var bilgi ="";



const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validatePhoneDate = (phone) => {
  return String(phone)
    .toLowerCase()
    .match(
      /^[+]*^[0][(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
    );
};

const validateBirth = (date) => {
  return String(date)
    .toLowerCase()
    .match(
      /\d{2} (Ocak|Åžubat|Mart|Nisan|MayÄ±s|Haziran|Temmuz|AÄŸustos|EylÃ¼l|Ekim|KasÄ±m|AralÄ±k) \d{4}/gimu
    );
};


http.createServer(function (req, res) {

    if (req.url == '/fileupload') {

        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

	try{
        var oldpath = files.filetoupload.filepath;
        var newpath = './' + files.filetoupload.originalFilename;
	path = newpath.slice(2).split('.')[0];

        fs.rename(oldpath, newpath, function (err) {
            //if (err) //throw err;
	});
	}catch(err){
	    var newpath = "./"
	}



    const ocr = spawn('python3', ['ocr_v2.py', newpath.slice(2)]);
    ocr.on('exit', (exitCode) => {

        if (parseInt(exitCode) !== 0) {
        //Handle non-zero exit
            console.log("error")
        }

        fs.readFile(path+".txt", (err, html) => {
        //console.log(path+".txt");

        lineReader.eachLine(path + '.txt', function(line) {
        line = utf8.encode(line);
        if (validateEmail(line) != null){
            bilgi = "<p>Mail " + validateEmail(line)[0];
        }
        if(validatePhoneDate(line) != null){
            if(validatePhoneDate(line)[0].includes("."))
            bilgi = "Date " + validatePhoneDate(line)[0];
        }
        if(validateBirth(line) != null){
            bilgi = "Birth Date " + validateBirth(line)[0];
        }

        //console.log(validateEmail(line));

    });
           
        //res.setHeader('Content-type', 'text/html');

        //html = fs.readFileSync('./index.html');
        //res.write(html);   
        
        if(err)
            res.write("Error load text to screen");
        else
	        
            //html = fs.readFileSync('./index.html');
            try{
                res.write("yuklendi!!!"); //html);
	    }catch(err){
		res.write("Provide a file");
	    }
            res.end();
    });


});
});
} else {

    //res.writeHead(200, {'Content-Type': 'text/html'});
    res.statusCode = 200;
    //res.set("Content-Type", "text/html") 
    res.setHeader('Content-type', 'text/html');
    var html = fs.readFileSync('./index.html');
    res.write(html);   
    return res.end();

  }
}).listen(8080);


