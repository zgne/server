var mongoose = require('mongoose');
mongoose.set('userCreateIndex',true);

var userSchema = mongoose.Schema({
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true},
	email: { type: String, required: true, index: {unique: true} },
	date: { type: Date, default: Date.now()}
});

var userModel = mongoose.model('user',userSchema);
userModel.createIndexes();

var save = (data)=>{ // 保存至数据库
	var user = new userModel(data);
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


// const findLogin = (data) =>{
//
// }

module.exports = {
	save,
	findLogin
};


