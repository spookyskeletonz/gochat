import  React, { Component } from 'react';
import ChatBox from './ChatBox.js';
import { Header, Button, Form } from 'semantic-ui-react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inRoom: false,
      roomName: '',
      userName: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState(
    {
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    this.setState(
    {
      inRoom: true
    });
  }

  render() {
    let appRender;
    // Now we have a conditional redering based on if in room yet or not
    if(this.state.inRoom === false){
      appRender = ( 
        <Form onSubmit={this.handleSubmit}>
          <Form.Field required>
            <label>userName</label>
            <input required placeholder='User Name' name='userName' value={this.state.userName} onChange={this.handleChange}/>
          </Form.Field>
          <Form.Field required>
            <label>roomName</label>
            <input required placeholder='Room Name' name='roomName' value={this.state.roomName} onChange={this.handleChange}/>
          </Form.Field>
          <Button type='submit'>Join</Button>
        </Form>
      );
    } else {
      appRender = (
        <ChatBox userName={this.state.userName} roomName={this.state.roomName} />
      );
    }

    return (
      <div className="App">
        <Header as='h1'>GoChat</Header>
        <p />
        {appRender}
      </div>
    );
  }
}

export default App;
