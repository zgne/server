const mongoose = require('mongoose');
mongoose.set('userCreateIndex',true);

let userSchema = mongoose.Schema({
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true},
	email: { type: String, required: true, index: {unique: true} },
	date: { type: Date, default: Date.now()}
});

const userModel = mongoose.model('user',userSchema);
userModel.createIndexes();

const save = (data)=>{ // 保存至数据库
	const user = new userModel(data);
	user.save()
		.then(()=>true)
		.catch(()=>false)
};

 //查询login的用户名/email和密码
const findLogin = (username, email, password) =>
	userModel.findOne({
		$or: [
			{username, password},
			{email, password}
		]
	});

//修改密码
const resetPwd = (email,password) =>{
	userModel.updateOne({ email },{ password })
		.then(()=> true)
		.catch(()=> false)
};

module.exports = {
	save,
	findLogin,
	resetPwd
};


