import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const host = 'http://localhost:3000';
const Test = () => {
  const [message, setMessage] = useState('');
  const [messList, setMessList] = useState([]);
  const socketRef = useRef();
  const handleSendMessage = () => {
    socketRef.current.emit('sendFromClient', message);
  };
  console.log(messList);

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);
    socketRef.current.on('sendFromServer', (data) => {
      setMessList((oldMsgs) => [...oldMsgs, { id: data.id, msg: data.msg }]);
    });
    return () => socketRef.current.disconnect();
  }, []);
  return (
    <>
      <div class="box-chat">
        {messList.map((m) => {
          <p key={m.id}>{m.msg}</p>;
        })}
        <div class="send-box">
          <textarea
            value={message}
            placeholder="Nhập tin nhắn ..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </>
  );
};

export default Test;
