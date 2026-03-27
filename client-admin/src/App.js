import './App.css';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MyProvider from './contexts/MyProvider';
import Login from './components/LoginComponent';
import Main from './components/MainComponent';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <MyProvider>
          <Login />
          <Main />
        </MyProvider>
      </BrowserRouter>
    );
  }
}

export default App;

/* ===== OLD VERSION (for reference) =====
import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Trang của Admin'
    };
  }

  componentDidMount() {
    axios.get('/hello')
      .then(res => {
        this.setState({ message: res.data.message });
      })
      .catch(() => {
        this.setState({ message: 'Error connecting to server' });
      });
  }

  render() {
    return (
      <div className="App">
        <h2>Admin page</h2>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default App;
===== END OLD VERSION ===== */
