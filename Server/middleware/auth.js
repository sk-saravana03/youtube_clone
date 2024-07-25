import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        // if (!req.headers.authorization) {
        //     console.error("Authorization header missing");
        //     return res.status(400).json("Authorization header missing");
        // }

        const token = req.headers.authorization.split(" ")[1];
        // if (!token) {
        //     console.error("Token missing in Authorization header");
        //     return res.status(400).json("Token missing in Authorization header");
        // }

        let decodedata = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedata?.id;

        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        res.status(400).json("Invalid credentials..");
    }
};

export default auth;
