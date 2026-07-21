import {Router} from "express"
import { sendMessage } from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middle.ware.js";

const chatRouter = Router();


chatRouter.post('/message',authUser,sendMessage);


export default chatRouter;


