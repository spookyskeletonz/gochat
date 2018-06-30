import React, { Component } from 'react';
import { Divider, Segment, Header } from 'semantic-ui-react';
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
        <Header as='h3' attached='top'>{this.props.roomName}</Header>
        <Segment raised attached>
          <Segment raised>
            <ChatMessages myName={this.props.userName} ref="chatMessages" />
          </Segment>
          <ChatInput userName={this.props.userName} roomName={this.props.roomName} socket={this.socket} />
        </Segment>
      </div>
    );
  }

}

export default ChatBox;
