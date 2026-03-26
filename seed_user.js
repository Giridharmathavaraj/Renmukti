import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import 'dotenv/config';

async function seedUser() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/loanpro_db';
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB Connected');

        const username = 'admin';
        const password = 'password123';

        // Check if exists and update role
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const existing = await User.findOne({ username });
        if (existing) {
            existing.role = 'superadmin';
            existing.password = hashedPassword;
            await existing.save();
            console.log('✅ Updated existing user to superadmin:', username);
            process.exit(0);
        }

        const newUser = new User({
            username,
            password: hashedPassword,
            role: 'superadmin' // Set as superadmin
        });

        await newUser.save();
        console.log('✅ Successfully created seed user:', username);
        console.log('Password is:', password);

        process.exit(0);
    } catch (err) {
        console.error('Error seeding user:', err);
        process.exit(1);
    }
}

seedUser();
