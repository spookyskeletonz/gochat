import  React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

class ChatMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    }
  }

  componentDidUpdate() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  onNewMessage(messageData) {
    this.state.messages.push(messageData);
    console.log(messageData);
    this.forceUpdate();
  }

  render() {
    return (
      <div className="ChatMessages" id="messages">
        <Container>
            {
              this.state.messages.map((m, i) => { 
                if(m.UserName === this.props.myName) {
                  return (
                      <p style={{ textAlign: 'left'}} key={i}><b>{m.UserName}:</b> {m.Message}</p>
                  );
                } else {
                  return (
                      <p style={{ textAlign: 'right'}} key={i}><b>{m.UserName}:</b> {m.Message}</p>
                  );
                }
              }
              )
            } 
        </Container>
      </div>
    );
  }
}

export default ChatMessages;
