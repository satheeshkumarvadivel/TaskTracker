
class RouteA extends React.Component {

    constructor(props) {
        super(props);
        this.fnameChange = this.fnameChange.bind(this);
        this.lnameChange = this.lnameChange.bind(this);
        this.emailIdChange = this.emailIdChange.bind(this);
        this.managerEmailIdChange = this.managerEmailIdChange.bind(this);
        this.newPasswordChange = this.newPasswordChange.bind(this);
        this.confirmPasswordChange = this.confirmPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            fname: '',
            lname: '',
            emailId: '',
            managerEmailId: '',
            newPassword: '',
            confirmPassword: ''

        }
    }

    fnameChange(event) {
        this.setState({ fname: event.target.value })
    };

    lnameChange(event) {
        this.setState({ lname: event.target.value })
    };

    emailIdChange(event) {
        this.setState({ emailId: event.target.value })
    };
    managerEmailIdChange(event) {
        this.setState({ managerEmailId: event.target.value })
    };
    newPasswordChange(event) {
        this.setState({ newPassword: event.target.value })
    };
    confirmPasswordChange(event) {
        this.setState({ confirmPassword: event.target.value })
    };

    handleSubmit() {
        if (this.state.fname != "" && this.state.lname != "" && this.state.emailId != "" && this.state.managerEmailId != "" && this.state.newPassword != "" && this.state.confirmPassword != "") {
            if (this.state.newPassword == this.state.confirmPassword) {
                var postData = {
                    "fname": this.state.fname,
                    "lname": this.state.lname,
                    "emailId": this.state.emailId,
                    "managerEmailId": this.state.managerEmailId,
                    "password": this.state.newPassword
                };

                let axiosConfig = {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    }
                };
                axios.post('/api/v1/users/signup', postData, axiosConfig)
                    .then((res) => {
                        if (res.status === 201) {
                            toastr.success("User created successfully...!")
                            location.href = "index.html"
                        }

                    })
                    .catch((err) => {
                        toastr.error(err.response.data.error);
                    })
            } else {
                //           toastr.options.timeOut = 1500;
                toastr.warning("NewPassword and ConfirmPassword should be same")
            }
        } else {
            toastr.warning("All Fields are Mandatory!");
        }


    }



    render() {
        return <div>
            <div className="login-container">
                <div className="login-box">
                    <div className="login-left-box">
                        <h2> Create an Account</h2>
                        <div className="form-group">
                            <label htmlFor="fname">First Name</label>
                            <input type="text" onChange={this.fnameChange} className="form-control" id="fname" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lname">Last Name</label>
                            <input type="text" onChange={this.lnameChange} className="form-control" id="lname" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailId">Email</label>
                            <input type="email" onChange={this.emailIdChange} className="form-control" id="emailId" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="managerEmailId">Manager's Email</label>
                            <input type="email" onChange={this.managerEmailIdChange} className="form-control" id="managerEmailId" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input type="password" onChange={this.newPasswordChange} className="form-control" id="newPassword" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" onChange={this.confirmPasswordChange} className="form-control" id="confirmPassword" />
                        </div>
                        <button type="submit" id="submit" onClick={this.handleSubmit} className="btn btn-primary">Create Account</button>
                        <br />
                        <p> Already have an account? <a href="index.html">Sign In</a></p>
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
const App = () => {
    return (<RouteA />)
};
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

