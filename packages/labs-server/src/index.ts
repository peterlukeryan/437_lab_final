import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { ImageProvider } from "./ImageProvider";
// import { ImageProvider } from "ImageProvider";



dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const PORT = process.env.PORT || 3000;
const staticDir = process.env.STATIC_DIR || "public";

const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;

const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${DB_NAME}`;
const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;

console.log("Attempting Mongo connection at " + connectionStringRedacted);


let mongoClient: MongoClient;

const setUpMongo = async () => {
    if (!mongoClient) {
        mongoClient = await MongoClient.connect(connectionString);
        console.log("Connected to MongoDB");
    }
    return mongoClient;
};

const app = express();

app.use(express.static(staticDir));

const indexPath = path.resolve(__dirname, "../../routing-lab/dist/index.html");
// setUpMongo();

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/api/images", async (req: Request, res: Response) => {
    try {
        // const client = await setUpMongo();
        // const provider = new ImageProvider(client); // No need to `await` here
        // const images = await provider.getAllImages(); // Await this call
        let images = {}
        if (mongoClient){
            const provider = new ImageProvider(mongoClient);
             images = await provider.getAllImagesDenormalized()
        }
        else {
            mongoClient = await setUpMongo();
            const provider = new ImageProvider(mongoClient);
            images = await provider.getAllImagesDenormalized();

        }
        res.json(images);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("*", (req: Request, res: Response) => {
    console.log("none of the routes above me were matched");
    res.sendFile(indexPath);
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

