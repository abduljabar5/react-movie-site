import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';
import helper from '../styles/images/chat.svg'
function App() {
  //   const [generatedText, setGeneratedText] = useState('');
  const [showName, setShowName] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setloading] = useState(false);

  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};

  if (Auth.loggedIn()) {
    console.log(Auth.getProfile().data.username);

  } else {
    console.log('login');
  }
  const messagesEndRef = React.useRef(null);

  const generateText = async () => {

    try {
      setloading(true);
      const historyPrompt = conversationHistory.map(conv => conv.generatedText).join(' ');

      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: `${historyPrompt} You are a helpful and knowledgeable AI, similar to Jarvis from Iron Man. Address the user with respect and provide informative and concise answers. The user's name is ${Auth.getProfile().data.username}.\n\n: ${showName} ?`,
        max_tokens: 400,
        n: 1,
        stop: null,
        temperature: 0.5,
        user: "Jake",
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY2}`,
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
      scrollToBottom();
      setloading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setShowName('');
    scrollToBottom();
  }, [isLoading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleHideChat = () => {
    setShowChat(false);
  };

  const handleShowChat = () => {
    setShowChat(true);
  };


  return (
    <main>
      {Auth.loggedIn() ? (
        <div>

          {showChat && (
            <div className='chat-container'>
              <div className="">
                <div className="box box-warning direct-chat direct-chat-warning">
                  <div className="box-header with-border text-center">
                    <h3 className="box-title">Chat Messages</h3>
                    <div className="box-tools pull-right">
                      <button type="button" class="btn-close" onClick={handleHideChat}></button>
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
                      Hello, I'm FilmBot, an AI here to answer your questions on movies, TV shows, and anime. How can i help?                      </div>
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
                          </div> </>
                      ))}
                      {isLoading ? (
                        <div className='text-center'><Spinner animation="grow" variant="secondary" /><Spinner animation="grow" variant="secondary" /><Spinner animation="grow" variant="secondary" /></div>

                      ) : (
                        <div></div>
                      )}
                      <div ref={messagesEndRef} />


                    </div>
                    <div className="box-footer">
                      <form action="#" method="post" onSubmit={(e) => {
                        e.preventDefault();
                        generateText();
                      }}>
                        <div className="input-group">
                          <input className='form-control' type="text" value={showName} onChange={(e) => setShowName(e.target.value)} />
                          <span className="input-group-btn">
                            <button type="submit" className="btn btn-primary"> Send <FontAwesomeIcon icon={faPaperPlane} /></button>
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
            <a className='chat-container' id='chat' onClick={handleShowChat}>
              <img className='helpericon' src={helper}></img>
              </a>

          )}</div>
      ) : (<div></div>)
      }
    </main >
  );

}
export default App;


