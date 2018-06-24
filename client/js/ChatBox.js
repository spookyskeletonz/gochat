import  React, { Component } from 'react';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ws: null,
      chatContent: '' 
    }
  }

  render() {
    return (
      <div className="ChatBox">
      </div>
    );
  }
}

export default ChatBox;
