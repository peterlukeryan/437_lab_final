import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import { ImageProvider } from "../ImageProvider";
import { handleImageFileErrors, imageMiddlewareFactory } from "../imageUploadMiddleware"

export function registerImageRoutes(app: express.Application, mongoClient: MongoClient) {
    app.get("/api/images", async (req: Request, res: Response) => {
    try {
        let userId: string | undefined = undefined;
        if (typeof req.query.createdBy === "string") {
            userId = req.query.createdBy;
        }
        
        let images = {}
        if (mongoClient){
            const provider = new ImageProvider(mongoClient);
             images = await provider.getAllImages(userId)
        }
        else {
            const provider = new ImageProvider(mongoClient);
            images = await provider.getAllImages();

        }
        res.json(images);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.patch("/api/images/:id",  async (req: Request, res: Response) => {
   
   if (!req.body.name){
    res.status(400).send({
        error: "Bad request",
        message: "Missing name property"
    });
    return;
   }
    
    const provider = new ImageProvider(mongoClient);
    const result = await provider.updateImageName(req.params.id, req.body.name);

    if (result == 0){
        res.status(404).send({
            error: "Not found",
            message: "Image does not exist"
        });
        return;
    }
    res.sendStatus(204);
   
});

app.post(
    "/api/images",
    imageMiddlewareFactory.single("image"),
    handleImageFileErrors,
    async (req: Request, res: Response) => {
        // Final handler function after the above two middleware functions finish running
        if (!req.file || !req.body){
            res.status(400).send({
                error: "Bad request",
                message: "Missing file or name"
            });
            return;
        }
        console.log(res.locals.token);
        const provider = new ImageProvider(mongoClient);
        const result = await provider.createImage(req.file.filename, `/uploads/${req.file.filename}`,req.body.name, 0, res.locals.token.username );
        res.sendStatus(201);

    }
)

}