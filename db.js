const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://sushantdehri6_db_food_user:fooddelivery@cluster0.pelccnv.mongodb.net/meal-mate-db?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB connected successfully!");

        // Fetch collections
        const foodCollection = mongoose.connection.db.collection("food_items");
        const data = await foodCollection.find({}).toArray();

        const categoryCollection = mongoose.connection.db.collection("foodCategory"); // check name carefully
        const catdata = await categoryCollection.find({}).toArray();

        console.log("🍔 Food Items:");
        console.log("📂 Food Category:");

        global.food_items = data;
        global.foodCategory = catdata;

    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = mongoDB;
