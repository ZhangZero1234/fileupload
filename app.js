var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser')
var formidable = require('formidable');
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true,limit:'50mb' }));

app.use(express.static(path.join(__dirname, 'public')))
app.listen(3000,function(){
	console.log("port 3000 listening");
});

app.get("/");
app.post("/image",function(req,res){
	var body = req.body;
	// chrome ff 传回来的的值
	console.log(Object.keys(body).length)
	if(Object.keys(body).length > 0)
	{   
		var base64Data = body.base64Data;
		base64Data = base64Data.replace(/\s/g,"+");
		base64Data = base64Data.replace(/^data:image\/\w+;base64,/,"");
		var base64Img1 = new Buffer(base64Data, 'base64');//将base64字符串转成base64的对象
		fs.writeFile("upload_img/"+body.filename, base64Img1, function(err) {
			if(err){
			  res.send(err);
			}else{
			  res.send("保存成功！");
			}
		});
	}
	// IE传回来的值
	else{
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields,files){
			var imgName = files["myfile"]["name"];
			var oldPath = files["myfile"]["path"];
			var newPath = './upload_img/'+imgName;
			console.log(oldPath)
			console.log(newPath)
			fs.rename(oldPath, newPath, function(){
				console.log("success");
			})
		})
	}

});

  // C:\Users\IBM_AD~1\AppData\Local\Temp\upload_a2c86a88a501997852201384cc21ca62