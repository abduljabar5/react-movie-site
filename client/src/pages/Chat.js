import React, { useState } from 'react';
import axios from 'axios';

import helper from '../styles/images/helper.svg'
function App() {
//   const [generatedText, setGeneratedText] = useState('');
  const [showName, setShowName] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);

  const generateText = async () => {
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: showName ,
        max_tokens: 400,
        n: 1,
        stop: null,
        temperature: 0.5,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      const newGeneratedText = response.data.choices[0].text;
    //   setGeneratedText(newGeneratedText);
      const newConversation = {
        showName: showName,
        generatedText: newGeneratedText,
        timestamp: Date.now(),
      };
      setConversationHistory([...conversationHistory, newConversation]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleHideChat = () => {
    setShowChat(false);
  };

  const handleShowChat = () => {
    setShowChat(true);
  };
  

  return (
    <main>
      {showChat && (
        <div className='chat-container'>
          <div className="">
            <div className="box box-warning direct-chat direct-chat-warning">
              <div className="box-header with-border text-center">
                <h3 className="box-title">Chat Messages</h3>
                <div className="box-tools pull-right">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleHideChat}></button>
                </div>
              </div>
              <div className="box-body">

                <div className="direct-chat-messages">
                     <div class="direct-chat-info clearfix">
                    <span class="direct-chat-name pull-left">Timona Siera</span>
                    <span class="direct-chat-timestamp pull-right">23 Jan 2:00 pm</span>
                  </div>
                 
                  <img class="direct-chat-img" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="message user image"></img>
               
                  <div class="direct-chat-text">
                    For what reason would it be advisable for me to think about business content?
                  </div>
                  {conversationHistory.map((conversation) => (
                    <><div class="direct-chat-msg right">
                          <div class="direct-chat-info clearfix">
                              <span class="direct-chat-name pull-right"></span>
                              <span class="direct-chat-timestamp pull-left">{new Date(conversation.timestamp).toLocaleString()}</span>
                          </div>

                          <img class="direct-chat-img" src="https://img.icons8.com/office/36/000000/person-female.png" alt="message user image"></img>

                          <div class="direct-chat-text mychat">
                             {conversation.showName}
                          </div>

                      </div><div className="direct-chat-msg">
                              <div className="direct-chat-info clearfix">
                                  <span className="direct-chat-name pull-right"></span>
                                  <span className="direct-chat-timestamp pull-right">{new Date(conversation.timestamp).toLocaleString()}</span>
                              </div>
                              <img className="direct-chat-img" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="message user image"></img>
                              <div className="direct-chat-text aichat">
                                  {conversation.generatedText}
                              </div>
                          </div></>
                  ))}
                </div>
                <div className="box-footer">
                  <form action="#" method="post">
                    <div className="input-group">
                      <input className='form-control' type="text" onChange={(e) => setShowName(e.target.value)} />
                      <span className="input-group-btn">
                        <button type="button" className="btn btn-primary" onClick={generateText}>Send</button>
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!showChat && (
        <a className='chat-container' onClick={handleShowChat}><img className='helpericon' src={helper}></img></a>

      )}
    </main>
  );
  
  }
  export default App;

  
