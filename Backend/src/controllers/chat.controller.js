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

export async function getChats(req,res){
    const chats = await chatModel.find({user:req.user.id}).sort({updatedAt:-1});
    res.status(200).json({
        message:"Chat recived successfully",
        chats
    })
}

export async function getMessages(req,res){
    const {chatId} = req.params;
    const chat = await chatModel.find({chat:chatId},{user:req.user.id});

    if(!chat){
        return res.status(404).json({
            message:"Chat not found"
        })
    }

    const message = await messageModel.find({chat:chatId});

    res.status(400).json({
        message:"Message retrived succeesfully",
        message
    })
}

export async function deleteChat(req,res){

    const { chatId } = req.params;
    
    const chat = await chatModel.findOneAndDelete({
        _id:chatId,
        user:req.user.id
    });

    await messageModel.deleteMany({
        chat : chatId
    })

    if(!chat){
        return res.status(400).json({
            message:"Chat not found"
        })
    }

    res.status(200).json({
        message:"Chat delete successfully"
    })

}


