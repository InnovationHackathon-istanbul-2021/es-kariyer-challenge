'use strict';

const { spawn } = require('child_process');
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = "";


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
/*
	const ocr = spawn('python3', ['ocr_v2.py', newpath]);
	ocr.on('exit', (exitCode) => {

        if (parseInt(exitCode) !== 0) {
        //Handle non-zero exit
            console.log("error")
        }

        fs.readFile(path+".txt", (err, html) => {
        console.log(path+".txt");
        if(err)
            res.write("Error");
        else
            res.write('<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">');
            res.write(html);
            res.end();
    });
*/
//    });

    const ocr = spawn('python3', ['ocr_v2.py', newpath.slice(2)]);
    ocr.on('exit', (exitCode) => {

        if (parseInt(exitCode) !== 0) {
        //Handle non-zero exit
            console.log("error")
        }

        fs.readFile(path+".txt", (err, html) => {
	console.log(path+".txt");
        if(err)
            res.write("Error");
        else
	    res.write('<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">');
            try{
                res.write(html);
	    }catch(err){
		res.write("Provide a file");
	    }
            res.end();
    });

});
});
} else {

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();

  }
}).listen(8080);
