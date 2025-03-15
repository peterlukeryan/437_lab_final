import { Request, Response, NextFunction } from "express";
import multer from "multer";
import dotenv from "dotenv";

class ImageFormatError extends Error {}
dotenv.config();

const storageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        // TODO 1: Set the upload folder based on the environment variable
        const uploadPath = process.env.IMAGE_UPLOAD_DIR || "uploads";
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // TODO 2
        let fileExtension = "";
        switch (file.mimetype) {
            case "image/png":
                fileExtension = "png";
                break;
            case "image/jpeg":
            case "image/jpg":
                fileExtension = "jpg";
                break;
            default:
                return cb(new ImageFormatError("Unsupported image type"), "");
        }

        // Generate a unique filename
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;

        cb(null, fileName);
    }
});

export const imageMiddlewareFactory = multer({
    storage: storageEngine,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
});

export function handleImageFileErrors(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof multer.MulterError || err instanceof ImageFormatError) {
        res.status(400).send({
            error: "Bad Request",
            message: err.message
        });
        return;
    }
    next(err); // Some other error, let the next middleware handle it
}