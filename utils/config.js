const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

var Mongoose = {
	url : 'mongodb://localhost:27017/server',
	connect(){
		mongoose.connect(this.url,{ useNewUrlParser: true },(err)=>{
			if(err){
				console.log('数据库连接失败');
				return
			}
			console.log('数据库连接成功')
		})
	}
};

var Email = {
	config: {
		host: 'smtp.qq.com',
		port: 587,
		auth:{
			user: '1169264363@qq.com',
			pass: 'vihdxvyyyouvhifh'
		}
	},
	get transporter(){
		return nodemailer.createTransport(this.config)
	},
	get verify(){
		return Math.random().toString().substring(2,6)
	}
};

module.exports = {
	Mongoose,
	Email
};
