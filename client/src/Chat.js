import React, {useState} from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { messagesQuery, addMessageMutation, messageAddedSubscription } from './graphql/queries';
import MessageInput from './MessageInput';
import MessageList from './MessageList';
import Loader from "react-loader-spinner";

const Chat = ({user}) => {
  const [messages, setMessages] = useState([]);
  // get messages on load
  const {loading, error} = useQuery(messagesQuery, {
    onCompleted: (data) => setMessages(data.messages)
  });
  
  // get on going messages after first load
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({subscriptionData}) => {
      setMessages(messages.concat(subscriptionData.data.messageAdded));
    }
  });

  // add user typed new messages and distribute
  const [addMessage] = useMutation(addMessageMutation);
  const handleSend = async (text) => {
    await addMessage({variables: {input: {text}}});
  }

  if (loading) {
    return (
      <div className="has-text-centered"><Loader type="Bars" color="#00BFFF" height={80} width={80} /></div>)
  }
  if (error) {
    return (
      <article class="message is-warning has-text-centered">
        <div class="message-header">
          <p>Warning</p>
          <button class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">
          {error.message}
        </div>
      </article>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
}

export default Chat;
