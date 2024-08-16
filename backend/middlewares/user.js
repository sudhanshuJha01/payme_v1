import jwt from "jsonwebtoken";
import { jwt_seceret } from "../config";

export const userAuthMiddleware = function(req ,res , next){
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(403).json({
                msg:"authHeader did not worked !"
            })
        }

        const token = authHeader.split(" ")[1];


        try {
            const decode = jwt.verify(token , jwt_seceret);
            req.userId = decode.userId;
            next();
        } catch (error) {
            console.log("Error in the header verification");
            return ;
            
        }
}