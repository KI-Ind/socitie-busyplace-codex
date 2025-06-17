import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
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
