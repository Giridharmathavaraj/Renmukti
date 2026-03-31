import mongoose from 'mongoose';
const LOCAL_URI = 'mongodb://127.0.0.1:27017/loanpro_db';

async function inspect() {
    console.log("Connecting to Local MongoDB...");
    try {
        const conn = await mongoose.connect(LOCAL_URI);
        console.log("✅ Local Connected.");
        
        // List databases
        const admin = conn.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log("Databases in Local Instance:");
        dbs.databases.forEach(db => console.log(`- ${db.name}`));

        // List collections in current DB
        const collections = await conn.connection.db.listCollections().toArray();
        console.log("\nCollections in loanpro_db:");
        collections.forEach(col => console.log(`- ${col.name}`));

        await mongoose.connection.close();
        process.exit(0);
    } catch (e) {
        console.error("❌ Inspection failed:", e.message);
        process.exit(1);
    }
}

inspect();
