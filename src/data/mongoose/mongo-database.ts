import mongoose from "mongoose";

interface Options {
    mongoURL: string;
    dbName: string;
}


export class MongoDatabase {
    static async connect(options: Options) {
        const { mongoURL, dbName } = options;
        try {
            
            await mongoose.connect(mongoURL, {
                dbName
            });
            
            console.log('Mongo connection success');
            
            return true;

        } catch (error) {
            console.log('Mongo connection error');
            throw error;
        }
    }
}