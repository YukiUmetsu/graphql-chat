import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { messagesQuery, addMessageMutation, messageAddedSubscription } from '../graphql/queries';

export function useChatMessages() {
  // get messages on load from server or cache
  const {data} = useQuery(messagesQuery);
  const messages = data ? data.messages : [];
  
  // get on going messages after first load
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({client, subscriptionData}) => {
      // write to apollo cache local state management
      client.writeData({data: {messages: messages.concat(subscriptionData.data.messageAdded)}});
    }
  });

  // add user typed new messages and distribute
  const [addMessage] = useMutation(addMessageMutation);

  return {
      messages,
      addMessage: (text) => addMessage({variables: {input: {text}}})
  };
}