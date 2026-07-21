import {GenerateResponse,GenerateChatTitle} from '../services/ai.service.js'
import { chatModel } from '../models/chat.model.js'
import { messageModel } from '../models/message.model.js'

export async function sendMessage(req,res){

    const {message,chat:chatId} = req.body;

    let title = null,chat = null;

    if(!chatId){
    title = await GenerateChatTitle(message);
    chat = await chatModel.create({
        user:req.user.id,
        title
    })
    }

    const humanMessage = await messageModel.create({
        chat: chatId || chat._id,
        content:message,
        role:"user"
    })

    const messages = await messageModel.find({chat: chatId || chat._id});

    const result = await GenerateResponse(messages);

    const aimessage = await messageModel.create({
        chat: chatId || chat._id,
        content:result,
        role:"ai"
    })

    res.status(201).json(
        {
            title,  
            chat,
            aimessage
        }
    );
}   






