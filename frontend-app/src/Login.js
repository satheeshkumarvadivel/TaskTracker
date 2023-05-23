import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import { Link, Navigate, BrowserRouter as Router } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.emailId = this.emailId.bind(this);
      this.password = this.password.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  
      this.state = {
        email: '',
        pass: '',
        toDashboard: false
      }
    }
  
    emailId(event) {
      this.setState({ email: event.target.value })
    };
    password(event) {
      this.setState({ pass: event.target.value })
    };

    componentDidMount() {

    }
  
  handleSubmit(event){
    if (this.state.email != "" && this.state.pass != "") {
      var signupData = {
        "emailId": this.state.email,
        "password": this.state.pass
      };
  
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        }
      };
      axios.post('/api/v1/users/signin', signupData, axiosConfig)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            this.setState({ toDashboard: true })
          }
          console.log("Login  successfully...!")

        })
        .catch((err) => {
          console.log(err.response.data.error);
        })
    } else {
      console.log("All Fields are Mandatory!");
    }
  }

  render(){
  console.log("Login  successfully...!!!")
    if (this.state.toDashboard) {
        console.log("Logging in...")
        return <Navigate to='/dashboard'/>
//        this.props.history.push('/dashboard')
    }
    return <div>
      <div className="login-container">
        <div className="login-box">
          <div className="login-left-box">
            <img src="images/checklist.webp" className="login-logo" alt="checklist" />
            <h2> Login</h2>
            <div className="form-group">
              <label htmlFor="emailId">Email</label>
              <input type="email" className="form-control" id="emailId" onChange={this.emailId} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" onChange={this.password} />
            </div>
            <button type="button" className="btn btn-primary" onClick={this.handleSubmit}  >Login</button>
            <br />
            <Link to='/signup'><p> Don't have an account?</p></Link>
          </div>
          <div className="login-right-box">
            <img src="images/cisco-logo.png" height="110px" width="175px" alt="cisco-logo" /> <br />
            <h1>EasyStatus</h1> <br />
            <p>Welcome to EasyStatus, a daily status tracker application to track the daily status of your reportees.
              You can SignUp with the application and add your team members to track their daily status. </p>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default Login;