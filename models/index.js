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

var save = (data)=>{
	var user = new userModel(data);
	user.save()
		.then(()=>true)
		.catch(()=>false)
};

module.exports = {
	save
};


