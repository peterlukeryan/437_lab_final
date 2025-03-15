import { CredentialsProvider } from "../CredentialsProvider";
import express, { NextFunction, Request, Response } from "express";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Read the .env file in the current working directory, and load values into process.env.
const signatureKey = process.env.JWT_SECRET!
if (!signatureKey) {
    throw new Error("Missing JWT_SECRET from env file");
}

export function verifyAuthToken(
    req: Request,
    res: Response,
    next: NextFunction // Call next() to run the next middleware or request handler
) {
    const authHeader = req.get("Authorization");
    // The header should say "Bearer <token string>".  Discard the Bearer part.
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.log(req)
        res.status(401).end();
    } else { // signatureKey already declared as a module-level variable
        jwt.verify(token, signatureKey, (error, decoded) => {
            if (decoded) {
                res.locals.token = decoded;
                next();
            } else {
                res.status(403).end();
            }
        });
    }
}



function generateAuthToken(username: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            { username: username },
            signatureKey,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token as string);
            }
        );
    });
}


export function registerAuthRoutes(app: express.Application, mongoClient: MongoClient) {
    app.post("/auth/register", async (req: Request, res: Response) => {
    
        const provider = new CredentialsProvider(mongoClient);
        console.log(req.body);
        if (!req.body.username || !req.body.password){
            //error
            res.status(400).send({
                error: "Bad request",
                message: "Missing username or password"
            });
            return;
        }
        const userName = req.body.username as string;
        const passWord = req.body.password as string;
        if (await provider.checkIfUserExists(userName)){
            res.status(400).send({
                error: "Bad request",
                message: "Username already taken"
            });
            return;
        }

        await provider.registerUser(userName, passWord);
        
    res.status(201).send({token: await generateAuthToken(req.body.username)})
       return;
    });

    app.post("/auth/login", async (req: Request, res: Response) => {
        
        if (!req.body.username || !req.body.password){
            //error
            res.status(400).send({
                error: "Bad request",
                message: "Missing username or password"
            });
            return;
        }
        const provider = new CredentialsProvider(mongoClient);
        if (await provider.verifyPassword(req.body.username, req.body.password)){
            res.status(201).send({token: await generateAuthToken(req.body.username)})
            return;
        }
        else {
            res.status(401).send({
                error: "Bad request",
                message: "Invalid username or password"
            })
        }
       
       return;
    });

}