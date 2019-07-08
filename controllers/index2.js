const {Email} = require('../utils/config');
const tokenUtil = require('../utils/token');
const userModel = require('../models/index');

var login = async (req, res, next) => {

};

var register = async (req, res, next) => {
	var { username, password, email, verify } = req.body;
	const userToken = req.headers.token;
	const data = {
		email: email,
		verifyCode: verify
	};
	const verifyToken = tokenUtil.createToken(data);
	if( userToken !== verifyToken ){
		res.send({
			msg: '用户名或验证码错误',
			status: -1
		})
	}

	const result = userModel.save({
		username,
		password,
		email
	});

	if(result){
		res.send({
			msg: '注册成功',
			status: 0
		})
	}else{
		res.send({
			msg: '注册失败',
			status: -2
		})
	}
};

var verify = async (req, res, next) => {
	const email = req.query.email;
	const verifyCode = Email.verify;
	const data = {
		email: email,
		verifyCode: verifyCode,
	};
	const token = tokenUtil.createToken(data,60*60);
	console.log(token);
	var mailOptions = {
		from: '轻旅验证码 1169264363@qq.com',
		to: email,
		subject: '轻旅验证码',
		text: '轻旅验证码: ' + verifyCode
	};
	Email.transporter.sendMail(mailOptions,(err)=>{
		if(err){
			res.send({
				msg: '验证码发送失败',
				status: -1
			})
		}else{
			res.send({
				msg: '验证码发送成功',
				status: 1,
				token,
			})
		}
	});
};

var logout = async (req, res, next) => {

};

var getUser = async (req, res, next) => {

};

var findPassword = async (req, res, next) => {

};

module.exports = {
	login,
	register,
	verify,
	logout,
	getUser,
	findPassword
}

