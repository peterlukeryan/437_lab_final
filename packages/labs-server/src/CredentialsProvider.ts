import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";

interface ICredentialsDocument {
    username: string;
    password: string;
}

export class CredentialsProvider {
    private readonly collection: Collection<ICredentialsDocument>;

    constructor(mongoClient: MongoClient) {
        const COLLECTION_NAME = process.env.CREDS_COLLECTION_NAME;
        if (!COLLECTION_NAME) {
            throw new Error("Missing CREDS_COLLECTION_NAME from env file");
        }
        this.collection = mongoClient.db().collection<ICredentialsDocument>(COLLECTION_NAME);
    }

    async checkIfUserExists(userName: string){
        const query = { username: userName };
        const user = await this.collection.findOne(query);
        if (user){
            console.error("User already exists");
            return true;
        }
        else {
            return false;
        }
    }

    async registerUser(username: string, plaintextPassword: string) {
        // TODO
        const query = { username: username };
        const user = await this.collection.findOne(query);
        if (!username || !plaintextPassword){
            console.error("Need to provide credentials");
            return false;
        }
        if (user){
            console.error("User already exists");
            return false;
        }
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(plaintextPassword, salt);
       const userDoc = {
        username: username,
        password: hashedPassword
       }
       const result = await this.collection.insertOne(userDoc);
        console.log("Insert Result:", result);
       
        return true;
    }

    async verifyPassword(username: string, plaintextPassword: string) {
        // TODO
        const query = { username: username };
        const user = await this.collection.findOne(query);
        const dbPassword = user?.password;
        if (dbPassword){
            return bcrypt.compare(plaintextPassword, dbPassword);
        }
        else {
            console.error("Error fetching password");
            return false;
        }
    }
}
