import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://dev_socitie_usr:12345678socitie123@10.8.0.52:27017/dev_socitie?authSource=dev_socitie';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

declare global {
  var mongoose: any; // This is a global type declaration
}

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const opts = {
    bufferCommands: true,
    autoIndex: true,
    maxPoolSize: 10,
  };

  const db = await mongoose.connect(MONGODB_URI, opts);
  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
