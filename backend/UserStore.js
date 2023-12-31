
const { MongoClient } = require('mongodb');

class UserStore {

    // ChatGPT usage: Yes
    constructor(connectionString, dbName) {
        this.client = new MongoClient(connectionString);
        this.dbName = dbName;
    }

    // ChatGPT usage: Yes
    async connect() {
        //handle error when trying to connect to UserDB
        try {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            this.usersCollection = this.db.collection('users');
            console.log("Connected to userStore db");
        } catch(error){
            console.error("Connection to MongoDB failed: ", error);
            throw error
        }
        
    }
    
    // ChatGPT usage: Yes
    async getUser(userId) {
        return await this.usersCollection.findOne({ userId });
    }

    // ChatGPT usage: Partial
    async getUserbyname(username){
        return await this.usersCollection.findOne({ username});
    }
    
    // ChatGPT usage: Yes
    async addUser(userDoc) {
        // Check if username already exists
        const existingUser = await this.usersCollection.findOne({ username: userDoc.username });
        if (existingUser) {
            return null
        }
    
        // Generate a unique userId (using MongoDB's ObjectId as an example)
        // If you're using another strategy for userId, adjust this part accordingly
        // userDoc.userId = userDoc._id || new require('mongodb').ObjectId().toString();
    
        // Insert the user
        const result = await this.usersCollection.insertOne(userDoc);
    
        // Fetch and return the inserted user
        return await this.usersCollection.findOne({ _id: result.insertedId });
    }
    
    // ChatGPT usage: Partial
    async updateUser(userId, updateDoc) {
        // Only allow certain fields to be updated
        await this.usersCollection.updateOne({ userId }, { $set: updateDoc });
        // Return the updated document
        return await this.getUser(userId);
    }

    // ChatGPT usage: Partial
    async deleteUser(userId) {
        return await this.usersCollection.deleteOne({ userId });  
    }

    // ChatGPT usage: No
    async deleteAllUsers() {
        return await this.usersCollection.deleteMany({});
    
    }

    // ChatGPT usage: No
    async close() {
        await this.client.close();
    }
}

module.exports = UserStore;
