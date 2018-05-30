var fs = require('fs');

var TwitterBot = require('node-twitterbot').TwitterBot
require('date-utils');
var request = require('request');
var app = require('express')();
// var https = require('https').Server(options, app);
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var Bot = new TwitterBot({
	"consumer_secret": "CONSUMER_SECRET_HERE",
	"consumer_key": "CONSUMER_KEY_HERE",
	"access_token": "ACCESS_TOKEN_HERE",
	"access_token_secret": "ACCESS_SECRET_HERE"
});

//app.use(expressResponse());
app.use(bodyParser.json());

app.get('/xcvuioMJRVBijnou34refyuiv34n9r7erhn7j834ftgn89w4r/message', function (req, res) {
	var message = req.query.message;
	var dt = new Date().toFormat('HH24시 MI분 SS초');
	var resBody;
	try {
		var messageObj = JSON.parse(message);
		var target = messageObj.target;
		var ipAddress = messageObj.ipAddress;

		if (target === 'AutoBlock') target = 'SMTP';

		var options = { method: 'GET',
			url: 'https://www.abuseipdb.com/report/json',
			qs: {
				key: 'ABUSEIPDB_API_KEY_HERE',
				category: '18',
				comment: 'Too Much Attempt ' + target + ' Login',
				ip: ipAddress
			},
			headers: { 'cache-control': 'no-cache' }
		};

		request(options, function (error, response, body) {
			if (error) console.log(error);

			// console.log(body);
			resBody = body;
		});

		Bot.tweet('스토리지 센터 알림 : [' + ipAddress + ']로부터 ' + target + '에 대한 이-지붐 시도를 감지했습니다. (AbuseIPDB 자동 리포트) [' + dt + ']');
		res.json({echo: message, report: resBody, message: 'Request sent. check your account.'});
	} catch (e) {
		Bot.tweet('스토리지 센터 알림 : ' + message + ' [' + dt + ']');

		res.json({echo: message, message: 'Request sent. check your account.'});
	}
});

app.post('/manualNotice', function (req, res) {
	var data = req.body.message;
	var authKey = req.headers.authkey;

	if (authKey === "MANUAL_PASSWORD_HERE") {
		Bot.tweet('관리자 알림 : ' + data);
		res.json({echo: data, message: 'Request sent. check your account.'});
	} else {
		res.json({echo: 'FUCK YOU.'});
	}
});


http.listen(33071, function() {
	console.log('listening on http port:33071');
});
