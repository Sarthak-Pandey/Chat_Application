import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});
import http from 'http';
import connectDB from "./src/config/database.js";
import app from "./src/app.js";
import { initializeServer } from './src/sockets/server.socket.js';

const PORT = process.env.PORT || 8000;


const httpServer = http.createServer(app);

initializeServer(httpServer);

connectDB()


    .then(() => {
        httpServer.on("error", (error) => {
            console.error("Express Server Error: ", error);
            throw error;
        });

        httpServer.listen(PORT, () => {
            console.log(`⚙️  Server is running on port: ${PORT}`);
            console.log(`🔗 Health check endpoint: http://localhost:${PORT}/health`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed! ", err);
    });
    
