import jwt from "jsonwebtoken";
import { jwt_secret } from "../Routes/userRouter.js";
import "dotenv/config.js";

export const userAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            msg: "Authorization header is missing or incorrect!",
        });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);
    
    try {
        const decoded = jwt.verify(token, jwt_secret);
        console.log(decoded.userId);
        
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Error in the header verification:", error);
        return res.status(401).json({
            msg: "Token is not valid!",
        });
    }
};
