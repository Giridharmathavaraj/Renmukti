import mongoose from 'mongoose';
import User from './src/models/User.js';

mongoose.connect('mongodb://127.0.0.1:27017/loanpro_db')
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
