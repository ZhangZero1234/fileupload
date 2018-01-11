~(function($){
	$.fn.uploader = function(options){

		var defaults = {
			//读取base64编码的图片数据
			"imgblob":null,
			// 默认允许上传图片的大小
			"maxSize":"50kb",
			"fileName":null,
			"fileList":false,
			// 允许上传的图片格式
			"typeAllow":"jpeg,jpg,png,gif",
			// 定义选择文件时，弹出框文件显示类型，默认是所有图片  
            'acceptType':'image/*',
            "timer":null,
			//隐藏form表单
			"formHide":{
				"position":"absolute",
				"clip":"rect(0px,0px,0px,0px)"
			}

		}

		var config = $.extend(defaults,options); 
		config.sizeWarning = '图片太大,请选择小于'+config.maxSize+'的图片';
		config.typeWarning = '您上传的图片格式不正确，请重新选择!'; 

		// 存储插件最外层的对象this
		var wrap = $(this);
		// 动态生成form表单,form表单提价会刷新页面,所以需要用ajax来替代
		
		var labelBody = '<label for="myfile">选择文件</label>';
		// <form action="/image" method="post" enctype="multipart/form-data" encoding="multipart/form-data" id="fromArear">
		var formBodyBegin = '<form action="'+ config.url +'" id="fromArear">';
		var formBody = '<input type="file" name="myfile" id="myfile" multiple="true"><input type="submit" value="提交" id="submit">';
		var formBodyend = '</form>';
		

		// 添加到页面中
		wrap.append(labelBody+formBodyBegin+formBody+formBodyend);
		$("#fromArear").css(config.formHide);


		function imgFormat(){
			var objImg = document.getElementById("myfile");
			console.log(objImg.files);
			// 如果objImg.files返回undefined说明不是在chrome 和 firefox 下,Chrome FireFox
			if(objImg.files && objImg.files[0])
			{
				config.fileName = objImg.files[0]['name'];
				var valid = checkSize(objImg);
				// 判断上传的图片大小是否超过设置的大小
				if(valid)
				{
					// 将图片转成base64,防止form表单提交刷新页面,使用ajax来代替submit提交
					//html5中的FileReader,将读取图片以base64的编码数据,FileReader是不兼容IE
					var reader = new FileReader();
					reader.readAsDataURL(objImg.files[0]);
					reader.onload = function(e){
						// e = e || window.event;
						// e.target.result 也可以获得上传图片的base64编码
						config.imgblob = this.result;
						postAjax();
					}
				}
				// 超过大小 return false
				else
				{
					return false;
				}
			}
			// IE
			else{
				//IE下，使用滤镜  ,必须要加blur() 否则document.selection.createRange().text会报错
				objImg.select();
				objImg.blur();
				//获取文本内容值，在IE中input type=file 选择文件之后input显示的是文件在本地的路径
				// document.selection.createRange() IE9 以下的可以获得路径
				var imgSrc = document.selection.createRange().text;
				console.log(imgSrc);
				document.selection.empty();  
				postAjax();
			}
			
		}

		function checkSize(imgObj){
			var imgSize = Math.ceil(parseInt(imgObj.files[0]['size'])/1024);
			var filetype = config.fileName.split(".")[1];
			if(imgSize>parseInt(config.maxSize))
			{
				alert(config.sizeWarning);
				return false;
			}
			else if(config.typeAllow.indexOf(filetype)==-1){
				alert(config.typeWarning);
				return false;
			}
			return true;
		}


		function postAjax(){
			// chrome firefox
			if(config.imgblob)
			{
				$.post(config.url,{'base64Data':config.imgblob,'type':'base64',"filename":config.fileName},function(data){
					
				});
			}
			// IE
			else
			{
				var submit = document.getElementById('submit');
				//先移除iframe  
                wrap.find('iframe#uploadiframe').remove(); 
                $("#fromArear")
                .attr("enctype","multipart/form-data")
                .attr("encoding","multipart/form-data")
                .attr("target","uploadiframe")
                .attr("method","POST");

                var iframeDiv = document.createElement('div');
                iframeDiv.className = "iframeDiv";
                iframeDiv.innerHTML='<iframe id="uploadiframe" name="uploadiframe" style="display:none"></iframe>';
                wrap.append(iframeDiv);
				submit.click()
			}
		}

		var myfile = document.getElementById('myfile');
		
		myfile.onchange = function(){
			// submit.click()
			imgFormat()
		}
	}
})(jQuery);