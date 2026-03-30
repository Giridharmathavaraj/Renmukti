import mongoose from 'mongoose';
import User from './src/models/User.js';
import Company from './src/models/Company.js';
import Loan from './src/models/Loan.js';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/loanpro_db';
const REMOTE_URI = 'mongodb+srv://giridharmathavaraj_db_user:JlqWzElUK6bDDVUt@cluster0.kjqzoqe.mongodb.net/loanpro_db?retryWrites=true&w=majority';

async function migrate() {
    console.log("Starting Migration Process...");

    try {
        console.log("Connecting to Local Database...");
        let localDb, remoteDb;
        try {
            localDb = await mongoose.createConnection(LOCAL_URI).asPromise();
            console.log("✅ Local DB Connected.");
        } catch (e) {
            console.error("❌ Failed to connect to Local DB. Is your local MongoDB running?");
            throw e;
        }
        
        console.log("Connecting to Remote (Atlas) Database...");
        try {
            remoteDb = await mongoose.createConnection(REMOTE_URI).asPromise();
            console.log("✅ Remote DB Connected.");
        } catch (e) {
            console.error("❌ Failed to connect to Remote DB. Did you allow your IP address in MongoDB Atlas Network Access?");
            throw e;
        }

        console.log("Databases connected successfully!");

        // Bind models to the explicit database connections
        const LocalUser = localDb.model('User', User.schema);
        const LocalCompany = localDb.model('Company', Company.schema);
        const LocalLoan = localDb.model('Loan', Loan.schema);

        const RemoteUser = remoteDb.model('User', User.schema);
        const RemoteCompany = remoteDb.model('Company', Company.schema);
        const RemoteLoan = remoteDb.model('Loan', Loan.schema);

        // Fetch all local data
        console.log("Reading data from Local Database...");
        const users = await LocalUser.find().lean();
        const companies = await LocalCompany.find().lean();
        const loans = await LocalLoan.find().lean();

        console.log(`Found:
        - ${users.length} Users
        - ${companies.length} Companies
        - ${loans.length} Loans`);

        // Important: For safe migration without duplicating, we will clear the remote collections first
        console.log("Clearing Remote Database collections to prevent duplicates (it should be empty anyway)...");
        await RemoteUser.deleteMany({});
        await RemoteCompany.deleteMany({});
        await RemoteLoan.deleteMany({});

        // Insert data into remote DB preserving exactly the same _ids
        console.log("Copying data to Remote Database...");
        if (users.length > 0) await RemoteUser.insertMany(users);
        if (companies.length > 0) await RemoteCompany.insertMany(companies);
        if (loans.length > 0) await RemoteLoan.insertMany(loans);

        console.log("✅ Migration completed successfully! ALL DATA HAS BEEN COPIED TO LIVE ATLAS.");
        
        // Close connections gracefully
        await localDb.close();
        await remoteDb.close();
        process.exit(0);

    } catch (error) {
        console.error("❌ Migration failed with error:", error);
        process.exit(1);
    }
}

migrate();
