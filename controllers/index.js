const {Email} = require('../utils/config');

var login = async (req, res, next) => {

};

var register = async (req, res, next) => {

};

var verify = async (req, res, next) => {
	const email = req.query.email;
	const verifyCode = Email.verify;
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
				msg: '验证码发送失败'
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

