import  React, { Component } from 'react';
import ChatBox from './ChatBox.js';
import { Segment, Grid, Header, Label, Button, Form } from 'semantic-ui-react';

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

  render() { let appRender;
    // Now we have a conditional redering based on if in room yet or not
    if(this.state.inRoom === false){
      appRender = ( 
        <Grid textAlign='center' verticalAlign='middle' style={{ height: '100%' }}>
          <Grid.Column computer={4} mobile={12} tablet={8}>
            <header className='Title'><p>GoChat</p></header>
            <Segment raised>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <input required placeholder='User Name' name='userName' value={this.state.userName} onChange={this.handleChange}/>
                </Form.Field>
                <Form.Field>
                  <input required placeholder='Room Name' name='roomName' value={this.state.roomName} onChange={this.handleChange}/>
                </Form.Field>
                <Button color='green' type='submit' fluid size='large'>Join</Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
      );
    } else {
      appRender = (
        <Grid textAlign='center' verticalAlign='middle' style={{ height: '100%' }}>
          <Grid.Column computer={8} mobile={15} tablet={12}>
            <header className='Title'><p>GoChat</p></header>
            <ChatBox userName={this.state.userName} roomName={this.state.roomName} />
          </Grid.Column>
        </Grid>
      );
    }

    return (
      <div className="App">
      <style>{`
      body > div,
      body > div > div,
      body > div > div > div.App {
        height: 100%;
      }
    `}</style>
            {appRender}
      </div>
    );
  }
}

export default App;
