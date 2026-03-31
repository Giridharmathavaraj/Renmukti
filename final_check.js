import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const REMOTE_URI = process.env.MONGODB_URI;

console.log('Verifying connection to:', REMOTE_URI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@'));

async function check() {
  try {
    const conn = await mongoose.connect(REMOTE_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections available:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  }
}

check();
