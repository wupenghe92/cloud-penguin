const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  username:     {type: String, required: true, unique: true},
  password:     {type: String, required: true},
  created:      {type: Date,   default: Date.now},
  friendliness: {type: Number, default: 0},
  played:       {type: Boolean, default: false},
});


userSchema.pre('save', function(next) {
  const user = this;
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  const hashedPassword = bcrypt.hashSync(user.password, salt);
  user.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = function(plainPassword) {
  return bcrypt.compareSync(plainPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);
