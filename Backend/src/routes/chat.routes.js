import {Router} from "express"
import { sendMessage,getChats,getMessages,deleteChat } from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middle.ware.js";

const chatRouter = Router();


chatRouter.post('/message',authUser,sendMessage);
chatRouter.get('/',authUser,getChats);
chatRouter.get('/:chatId/messages',authUser,getMessages);
chatRouter.delete('/delete/:chatid/',authUser,deleteChat);

export default chatRouter;




