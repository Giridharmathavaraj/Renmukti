import mongoose from 'mongoose';
import User from './src/models/User.js';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/loanpro_db';
mongoose.connect(MONGODB_URI)
  .then(async () => {
    let user = await User.findOne({ username: 'GIRIDHAR M' });
    if (user) {
      if (user.role === 'users') {
        user.role = 'admin';
        await user.save();
        console.log('Updated GIRIDHAR M to admin role');
      } else {
        console.log('GIRIDHAR M is already ' + user.role);
      }
    } else {
      console.log('User GIRIDHAR M not found.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
