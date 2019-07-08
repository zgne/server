const {Email} = require('../utils/config');
const tokenUtil = require('../utils/token');
const userModel = require('../models/index');

var login = async (req, res, next) => {
	const { username, email, password } = req.body;
	const loginResult = await userModel.findLogin(username,email,password);
	if( loginResult ){
		console.log('登录成功');
		res.send({
			msg: '登录成功',
			status: 0
		})
	}else{
		console.log('登录失败');
		res.send({
			msg: '登录失败',
			status: -3
		})
	}
};

var register = async (req, res, next) => {
	console.log(0);
	var {username, password, email, verify} = req.body;
	const userToken = req.body.token;
	const data = {
		email: email,
		verifyCode: verify
	};
	// const verifyToken = tokenUtil.createToken(data);
	// if( userToken !== verifyToken ){
	// 	res.send({
	// 		msg: '用户名或验证码错误',
	// 		status: -1
	// 	})
	// }
	if (tokenUtil.createToken(userToken)) {
		const resultToken = tokenUtil.decodeToken(userToken);
		// console.log(resultToken.payload.data);
		const payload = resultToken.payload;
		/**
		 * { payload:
   { data: { email: 'zg17805106202@163.com', verifyCode: '9207' },
     created: 1562571565,
     exp: 3600 },
		 signature: 'ClRU5D2i2zlZsWFihCX/oQynnSDxA84mZQN+Zpp31GA=',
		 checkSignature: 'ClRU5D2i2zlZsWFihCX/oQynnSDxA84mZQN+Zpp31GA=' }

		 */

		if (payload.data.email !== email || payload.data.verifyCode !== verify) {
			console.log(1);
			res.send({
				msg: '用户名或验证码错误',
				status: -1
			});
			return
		}

	}

	const result = userModel.save({
		username,
		password,
		email
	});

	if (result) {
		console.log(2);
		res.send({
			msg: '注册成功',
			status: 0
		})
	} else {
		console.log(3);
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
	const token = tokenUtil.createToken(data, 60 * 60);
	console.log(token);
	const mailOptions = {
		from: '轻旅验证码 1169264363@qq.com',
		to: email,
		subject: '轻旅验证码',
		text: '轻旅验证码: ' + verifyCode
	};
	Email.transporter.sendMail(mailOptions, (err) => {
		if (err) {
			res.send({
				msg: '验证码发送失败',
				status: -1
			})
		} else {
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
};

