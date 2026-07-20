import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});
import connectDB from "./src/config/database.js";
import app from "./src/app.js";

const PORT = process.env.PORT || 8000;


connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.error("Express Server Error: ", error);
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`⚙️  Server is running on port: ${PORT}`);
            console.log(`🔗 Health check endpoint: http://localhost:${PORT}/health`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed! ", err);
    });
    
