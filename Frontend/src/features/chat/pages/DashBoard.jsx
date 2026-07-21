import react, {useEffect} from 'react'
import {useChat} from "../hooks/useChat"


const DashBoard = ()=>{
    const chat = useChat();

    useEffect(()=>{
        const socket = chat.intitlizeSocketConnection();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    
    return (

        <div>Dashword</div>
    )
}

export default DashBoard;
