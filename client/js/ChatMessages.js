import  React, { Component } from 'react';

class ChatMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    }
  }

  onNewMessage(messageData) {
    this.state.messages.push(messageData);
    console.log(messageData);
    this.forceUpdate();
  }

  render() {
    return (
      <div className="ChatMessages">
        <ul>
          {
            this.state.messages.map(function(m, i){ 
              return (
                <li key={i}>
                  <b>{m.UserName}:</b> {m.Message}
                </li>
              );
            }
            )
          } 
        </ul>
      </div>
    );
  }
}

export default ChatMessages;
