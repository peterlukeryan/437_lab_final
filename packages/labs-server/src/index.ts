import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient } from "mongodb";
import { ImageProvider } from "./ImageProvider";
import { registerImageRoutes } from "./routes/images";
import { registerAuthRoutes, verifyAuthToken } from "./routes/auth";


dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const setUpRoutes = async () => {
    const PORT = process.env.PORT || 3000;
    const staticDir = process.env.STATIC_DIR || "public";

    const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER, DB_NAME } = process.env;

    const connectionStringRedacted = `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${DB_NAME}`;
    const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;

    console.log("Attempting Mongo connection at " + connectionStringRedacted);


    var mongoClient: MongoClient | null = null;

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
    await setUpMongo();

    app.use(express.json());
    app.get("/hello", (req: Request, res: Response) => {
        res.send("Hello, World");
    });

    if (mongoClient){
        app.use("/api/*", verifyAuthToken);
        registerAuthRoutes(app, mongoClient);
        registerImageRoutes(app, mongoClient);
    }
    else {
        console.log("Mongo client not setup properly.")
    }


    app.get("*", (req: Request, res: Response) => {
        console.log("none of the routes above me were matched");
        res.sendFile(indexPath);
    });


    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

}
setUpRoutes();

