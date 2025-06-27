import React from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '../types/Message';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </>
  );
};

export default MessageList;