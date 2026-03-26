import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/loanpro_db')
  .then(async () => {
    let user = await User.findOne({ username: 'GIRIDHAR M' });
    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash('password123', salt);
      await user.save();
      console.log('Username: ' + user.username);
      console.log('Password: password123');
    } else {
      console.log('User GIRIDHAR M not found.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
