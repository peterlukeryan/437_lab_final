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

    async getAllImages(author?: string): Promise<ImageSchema[]> {
        if (!this.imagesCollection) {
            throw new Error("Missing collection name from environment variables");
        }
    
        const collection = this.mongoClient.db().collection<ImageSchema>(this.imagesCollection);
        
        // Define the filter for the images collection
        const filter: any = {};
        
        if (author) {
            filter.author = author;  // Filter by author if provided
        }
        
        // Fetch images without denormalization (no $lookup stage)
        const images = await collection.find(filter).toArray();
    
        return images;  // Return the images directly without author details
    }
    
   

    async updateImageName(imageId: string, newName: string): Promise<number> {
        
        if (!this.imagesCollection || !this.usersCollection) {
            throw new Error("Missing collection names from environment variables");
        }
        const collection = this.mongoClient.db().collection<ImageSchema>(this.imagesCollection);
        const result = await collection.updateOne({_id: imageId}, {$set: {name: newName}})
        return result.matchedCount;
        
    }
    //_id can be the image file name (req.file.filename), as it's quite likely to be unique.
// src should be the route at which the images are served. In this case we have it configured to be `/uploads/${filename}`.
// name should be the image name that the user submitted in the form (look inside req.body).
// likes should be 0.
// author
async createImage(_id: string, src: string, name: string, likes: number, author: string): Promise<number> {
    const collection = this.mongoClient.db().collection<ImageSchema>(this.imagesCollection!);

    // Create an image object based on the parameters
    const newImage: ImageSchema = {
        _id,   // Using shorthand syntax, _id: _id
        src,
        name,
        likes,
        author,
    };

    try {
        // Insert the new image object into the collection
        const result = await collection.insertOne(newImage);

        // Return the inserted count (usually 1 for insertOne)
        return 1;
    } catch (error) {
        // Handle any potential errors during the insertion
        console.error('Error inserting image:', error);
        return 0; // Return 0 if insertion fails
    }
}

    
}
