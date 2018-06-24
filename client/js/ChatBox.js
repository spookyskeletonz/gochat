import React, { Component } from 'react';
import ChatMessages from './ChatMessages.js'; 
import ChatInput from './ChatInput.js';

class ChatBox extends Component{

  constructor(props){
    super(props);
    this.socket = new WebSocket('ws://' + window.location.host + '/ws?roomName='+this.props.roomName);
  }

  onSocketMessage(message) {
    let data = JSON.parse(message.data);
    console.log(data);
    this.refs.chatMessages.onNewMessage(data);
  }

  componentDidMount() {
    this.socket.onmessage = (m) => this.onSocketMessage(m);
  }

  render() {
    return (
      <div id="ChatBox">
        <div className="chatMessages">
          <ChatMessages ref="chatMessages" />
        </div>
        <div className="input">
          <ChatInput userName={this.props.userName} roomName={this.props.roomName} socket={this.socket} />
        </div>
      </div>
    );
  }

}

export default ChatBox;
