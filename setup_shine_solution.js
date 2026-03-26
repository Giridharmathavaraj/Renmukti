import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Company from './src/models/Company.js';

async function setupShineSolution() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/loanpro_db');
    
    // Find Shine Solution
    let company = await Company.findOne({ name: 'Shine Solution' });
    if (!company) {
      console.log('Company Shine Solution not found in DB.');
      process.exit(1);
    }

    // Find if there is an existing admin, or create one
    let user = await User.findOne({ companyId: company._id, role: 'admin' });
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (user) {
      user.password = hashedPassword;
      await user.save();
      console.log(`Username: ${user.username}`);
      console.log(`Password: ${password}`);
    } else {
      // Check if there is ANY user for this company to promote
      user = await User.findOne({ companyId: company._id });
      if (user) {
          user.role = 'admin';
          user.password = hashedPassword;
          await user.save();
          console.log(`Username: ${user.username}`);
          console.log(`Password: ${password}`);
      } else {
          // completely new user
          const username = 'shinesolutionadmin';
          user = new User({
            username,
            password: hashedPassword,
            role: 'admin',
            companyId: company._id,
            status: 'enable'
          });
          await user.save();
          console.log(`Username: ${username}`);
          console.log(`Password: ${password}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setupShineSolution();
