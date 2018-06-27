import  React, { Component } from 'react';
import ChatBox from './ChatBox.js';
import { Segment, Grid, Header, Button, Form } from 'semantic-ui-react';

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
        <div className='entry-form'>
          <Header as='h2'>Enter a Room</Header>
          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment raised padded='very'>
              <Form.Field fluid required>
                <label>userName</label>
                <input required placeholder='User Name' name='userName' value={this.state.userName} onChange={this.handleChange}/>
              </Form.Field>
              <Form.Field fluid required>
                <label>roomName</label>
                <input required placeholder='Room Name' name='roomName' value={this.state.roomName} onChange={this.handleChange}/>
              </Form.Field>
              <Button color='green' type='submit' fluid size='large'>Join</Button>
            </Segment>
          </Form>
        </div>
      );
    } else {
      appRender = (
        <ChatBox userName={this.state.userName} roomName={this.state.roomName} />
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
        <Grid textAlign='center' verticalAlign='middle' style={{ height: '100%' }}>
          <Grid.Column style={{ maxwidth: 450 }}>
            <Header as='h1' color='green'>GoChat</Header>
            {appRender}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
