import mongoose from 'mongoose';
import Loan from './src/models/Loan.js';
import User from './src/models/User.js';
import Company from './src/models/Company.js';
import dotenv from 'dotenv';
dotenv.config();

const REMOTE_URI = process.env.MONGODB_URI || 'mongodb+srv://giridharmathavaraj_db_user:JlqWzElUK6bDDVUt@cluster0.kjqzoqe.mongodb.net/loanpro_db?retryWrites=true&w=majority';

async function verify() {
    console.log("Connecting to Atlas for Verification...");
    try {
        await mongoose.connect(REMOTE_URI);
        console.log("✅ Atlas Connected.");
        
        const userCount = await User.countDocuments();
        const companyCount = await Company.countDocuments();
        const loanCount = await Loan.countDocuments();
        
        console.log(`Current Counts in Atlas:
        - Users: ${userCount}
        - Companies: ${companyCount}
        - Loans: ${loanCount}`);
        
        await mongoose.connection.close();
        process.exit(0);
    } catch (e) {
        console.error("❌ Verification failed:", e.message);
        process.exit(1);
    }
}

verify();
