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
    
    imagesCollection = process.env.IMAGES_COLLECTION_NAME;
     
    usersCollection = process.env.USERS_COLLECTION_NAME;
    constructor(private readonly mongoClient: MongoClient) {}

    async getAllImagesDenormalized(author?: string): Promise<(ImageSchema & { author: UserSchema })[]> {
        
    
        if (!this.imagesCollection || !this.usersCollection) {
            throw new Error("Missing collection names from environment variables");
        }
    
        const collection = this.mongoClient.db().collection<ImageSchema>(this.imagesCollection);
    
        // Define the aggregation pipeline
        const aggregationPipeline: any[] = [];
    
        // Conditionally add the $match stage if author is provided
        if (author) {
            aggregationPipeline.push({
                $match: { author: author } // Filter by the provided author ID
            });
        }
    
        aggregationPipeline.push(
            {
                $lookup: {
                    from: this.usersCollection,  // Users collection
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
            }
        );
    
        const images = await collection.aggregate(aggregationPipeline).toArray();
        return images as (ImageSchema & { author: UserSchema })[];
    }

    async updateImageName(imageId: string, newName: string): Promise<number> {
        
        if (!this.imagesCollection || !this.usersCollection) {
            throw new Error("Missing collection names from environment variables");
        }
        const collection = this.mongoClient.db().collection<ImageSchema>(this.imagesCollection);
        const result = await collection.updateOne({_id: imageId}, {$set: {name: newName}})
        return result.matchedCount;
        
    }
    
}
