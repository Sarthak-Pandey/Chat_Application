import {GenerateResponse,GenerateChatTitle,GenerateResponseStream} from '../services/ai.service.js'
import { chatModel } from '../models/chat.model.js'
import { messageModel } from '../models/message.model.js'
import { getIO } from '../sockets/server.socket.js'

export async function sendMessage(req,res){
    const {message,chat:chatId,socketId,tempId} = req.body;

    let title = null,chat = null;

    if(!chatId){
        title = await GenerateChatTitle(message);
        chat = await chatModel.create({
            user:req.user.id,
            title
        });
    }

    const humanMessage = await messageModel.create({
        chat: chatId || chat._id,
        content:message,
        role:"user"
    });

    const messages = await messageModel.find({chat: chatId || chat._id});

    if (socketId) {
        let fullResponse = "";
        const io = getIO();
        
        try {
            const stream = GenerateResponseStream(messages);
            for await (const chunk of stream) {
                fullResponse += chunk;
                io.to(socketId).emit("message:token", {
                    chatId: chatId || chat._id,
                    content: chunk,
                    tempId
                });
            }
            
            const aimessage = await messageModel.create({
                chat: chatId || chat._id,
                content: fullResponse,
                role: "ai"
            });

            io.to(socketId).emit("message:done", {
                chatId: chatId || chat._id,
                aimessage,
                tempId
            });

            return res.status(201).json({
                title,
                chat,
                aimessage,
                streamed: true
            });
        } catch (error) {
            console.error("Streaming error:", error);
            io.to(socketId).emit("message:error", {
                tempId,
                message: "Error during streaming response generation."
            });
            throw error;
        }
    } else {
        const result = await GenerateResponse(messages);

        const aimessage = await messageModel.create({
            chat: chatId || chat._id,
            content:result,
            role:"ai"
        });

        return res.status(201).json({
            title,
            chat,
            aimessage
        });
    }
}   


export async function getChats(req,res){
    const chats = await chatModel.find({user:req.user.id}).sort({updatedAt:-1});
    const chatsWithSnippet = await Promise.all(chats.map(async (chat) => {
        const lastMessage = await messageModel.findOne({ chat: chat._id }).sort({ createdAt: -1 });
        return {
            ...chat.toObject(),
            lastSnippet: lastMessage ? lastMessage.content : "No messages yet",
            lastSnippetRole: lastMessage ? lastMessage.role : null
        };
    }));
    res.status(200).json({
        message:"Chat recived successfully",
        chats: chatsWithSnippet
    })
}


export async function getMessages(req,res){
    const {chatId} = req.params;
    const chat = await chatModel.findOne({_id:chatId,user:req.user.id});

    if(!chat){
        return res.status(404).json({
            message:"Chat not found"
        })
    }

    const message = await messageModel.find({chat:chatId});

    res.status(200).json({
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


