import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null
}


// Caching to avoid too many mongodb connection open for each and evey action performed on the server side.

// When we try to connec to database
// 1. Check to see of we have a chached connection. If we do we exit out immediately 

//2. If not try to make a new connection to MongoDB
// Maybe get rid of '{}' later if connection is not working
let cached: MongooseConnection = (global as any).mongoose || {};

if(!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null
    }
}

export const connectToDatabase = async () => {
    if(cached.conn) return cached.conn;

    if(!MONGODB_URL) throw new Error('MONGODB_URL is not defined');

    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, { dbName: 'imaginify', bufferCommands: false })

    cached.conn = await cached.promise;

    return cached.conn;
}