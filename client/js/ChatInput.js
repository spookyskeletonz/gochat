import React, { Component } from 'react';
import { Container, Button, Form } from 'semantic-ui-react';

class ChatInput extends Component {
    
  constructor(props) {
    super(props);

    this.state = {
      input: ''
    };

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
    console.log(this.state.input);
    this.props.socket.send(JSON.stringify({
      userName: this.props.userName,
      roomName: this.props.roomName,
      message: this.state.input
    }));
    this.setState(
    {
      input: ''
    });
  }

  render() {
    return (
      <Container textAlign='center'>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group inline>
            <Form.Field fluid>
              <input required placeholder='Write a message' name='input' value={this.state.input} onChange={this.handleChange}/>
            </Form.Field>
            <Form.Button color='green' type='submit'>Send</Form.Button>
          </Form.Group>
        </Form>
      </Container>
    );
  }

}

export default ChatInput
