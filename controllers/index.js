const {Email} = require('../utils/config');
const tokenUtil = require('../utils/token');
const userModel = require('../models/index');

var login = async (req, res, next) => { // 用户登录
	const { username, email, password } = req.body;
	const loginResult = await userModel.findLogin(username,email,password);
	if( loginResult ){
		// console.log(loginResult);
		/**
		 * 		console.log(loginResult);
		 * {  date: 2019-07-08T07:46:37.378Z,
				  _id: 5d22f4f767c19450e058ea6d,
				  username: 'zgne',
				  password: 'aaaaaaa',
				  email: 'zg17805106202@163.com',
				  __v: 0 }

		 */
		let token = tokenUtil.createToken(loginResult,60*60);
		/** let token1 = tokenUtil.createToken(loginResult,60*60); //与上面一样，因为时间相差很少
		 *  console.log(token);
		 *  console.log(token1);
		 */

		res.send({
			msg: '登录成功',
			status: 0,
			token
		})
	}else{
		console.log('登录失败');
		res.send({
			msg: '登录失败',
			status: -3
		})
	}
};

var register = async (req, res, next) => { // 注册
	console.log(0);
	var {username, password, email, verify} = req.body;
	const userToken = req.headers.token;
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

	const result = userModel.save({// 将数据保存到数据库中，密码应该加密后保存
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

var verify = async (req, res, next) => { // 发送验证码
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
	req.headers.token = '';
	res.send({
		msg: '退出成功',
		status: 0,
		token: ''
	})
};

var getUser = async (req, res, next) => {
// app.js 中间件校验代码相同
// 	console.log(1);
	const token = req.headers.token;
	const resultToken = tokenUtil.decodeToken(token);
	const result = tokenUtil.checkToken(token);
	const username = resultToken.payload.data.username;
	if(result && username){
		// console.log(2);
		res.send({
			msg: '获取用户信息成功',
			status: 0,
			data: {
				username: username
			}
		})
	}else{
		// console.log(3);
		res.send({
			msg: '获取用户信息失败',
			status: -1
		})
	}
};

var resetPassword = async (req, res, next) => {
	let { email, verify, password } = req.body;
	const token = req.headers.token;
	const resultToken = tokenUtil.decodeToken(token);
	const payloadData = resultToken.payload.data;
	// console.log(payloadData);
	if(payloadData.email === email && payloadData.verifyCode === verify){
		// console.log(1);
		const resetPwdResult = await userModel.resetPwd(email,password);
		// console.log(resetPwdResult);
		resetPwdResult? res.send({
			msg: '修改密码成功',
			status: 0
		}): res.send({
			msg: '修改密码失败',
			status: -1
		})
	}
};

module.exports = {
	login,
	register,
	verify,
	logout,
	getUser,
	resetPassword
};

