import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/loanpro_db';
mongoose.connect(MONGODB_URI)
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
