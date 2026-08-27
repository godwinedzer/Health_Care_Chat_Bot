import React from "react";
import "../cssFiles/Message.css";

interface MessageProps {
    text: string;
    isUser: boolean;
}

const Message: React.FC<MessageProps> = ({ text, isUser }) => {
    if (!text.trim()) return null;

    return (
        <div 
            className={`message-container ${isUser ? "user-message" : "bot-message"}`} 
            {...(!isUser ? { "aria-live": "polite", role: "status" } : {})}
            style={!isUser ? { textAlign: "justify", whiteSpace: "pre-wrap" } : {}}
        >
            {!isUser ? <p dangerouslySetInnerHTML={{ __html: text }} /> : <p>{text}</p>}
        </div>
    );
};


export default Message;
