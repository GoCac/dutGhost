// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.get('/test', function(req, res) {
	var CronJob = require('cron').CronJob;
	var http = require('http');

	var serialNumbers = new Array();
	for (var i = 0;i < (201300000 - 201208170);i++){
	    serialNumbers[i] = 201208170 + i;
	}

	var Student = AV.Object.extend('student'); 

	new CronJob('*/1 * * * * *',function(){
		if (serialNumbers.length == 0) {
  			res.render('hello', { message: 'Congrats, you just set up your app!' });
  			return;
		};
	    var serialNumer = serialNumbers.shift();
	    console.log(serialNumer);
	    var queryString = "http://202.118.65.53/mobileplatform/unifiedEntranceModel.do?functionPyname=cxyktjbxx&param={%22ydusertype%22:%220%22,%22imei%22:%22%3C27dfe3be%202fcfd3d1%200718b0ee%20a7d21cea%20af88da96%2049624317%20bbe2e244%2094157914%3E%22,%22param%22:%22"+ serialNumer.toString() +"%22,%22appid%22:%22dlut-ylkxt%22}";
	    var body = '';
	    var req = http.get(queryString, function(res) {
	        console.log("Got response: " + res.statusCode);
	        res.on('data',function(d){
	            body += d;
	        }).on('end', function(){
	            var obj = eval("("+body+")");
	            if (obj.idserial.toString().length == 9){
	            	console.log(obj.username);
					var query = new AV.Query(Student);  
       				query.equalTo("serialNumber", Number(obj.idserial));
       				query.find().then(function(results) {
						// 成功获得实例
						var student = results[0];
						if (!student) {
							console.log('初次添加');       
							var student = new Student(); 
							student.set("name",obj.username);
							student.set("serialNumber",Number(obj.idserial));
							student.save(); 
						}else if (student.get('serialNumber') == Number(obj.idserial)) {
					  		console.log('重复的');  
							return;
						}else{ 
					  		console.log('啥情况？');  
							return;
						}
					}, function(error) {
						// 失败了
						return;
					});
	            }
	        });
	    }).on('error', function(e) {
	        console.log("Got error: " + e.message);
	    });
	    req.end();

	},null,true,null);
  res.render('hello', { message: '你退下吧。' });
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();