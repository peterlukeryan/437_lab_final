import { MongoClient } from "mongodb";

interface ImageSchema {
    _id: string;
    src: string;
    name: string;
    author: string;  // Currently stores only the user ID
    likes: number;
}

interface UserSchema {
    _id: string;
    username: string;
    email: string;
}

export class ImageProvider {
    constructor(private readonly mongoClient: MongoClient) {}

    async getAllImagesDenormalized(): Promise<(ImageSchema & { author: UserSchema })[]> {
        const imagesCollection = process.env.IMAGES_COLLECTION_NAME;
        const usersCollection = process.env.USERS_COLLECTION_NAME;

        if (!imagesCollection || !usersCollection) {
            throw new Error("Missing collection names from environment variables");
        }

        const collection = this.mongoClient.db().collection<ImageSchema>(imagesCollection);

        const images = await collection.aggregate([
            {
                $lookup: {
                    from: usersCollection,  // Users collection
                    localField: "author",   // The field in images referencing users
                    foreignField: "_id",    // The matching field in users
                    as: "authorDetails",    // Output field
                },
            },
            {
                $unwind: "$authorDetails" // Convert the array into an object
            },
            {
                $project: {
                    _id: 1,
                    src: 1,
                    name: 1,
                    likes: 1,
                    author: {
                        _id: "$authorDetails._id",
                        username: "$authorDetails.username",
                        email: "$authorDetails.email",
                    }, // Replace author with user details
                },
            },
        ]).toArray();

        return images as (ImageSchema & { author: UserSchema })[];
    }
}
