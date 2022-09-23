class PostTaskGroups extends React.Component {
    constructor(props) {
        super(props);
        this.taskGroup = this.taskGroup.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            group: ''
        };
    }

    taskGroup(event) {
        this.setState({ group: event.target.value });
    }

    render() {
        if(JSON.parse(window.localStorage.getItem('user')).isManager == "Y") {
            return (<div>
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                    <i className="fa fa-plus" aria-hidden="true"></i>
                </button>

                <div className="modal" id="exampleModal" tabIndex="-1" role="dialog">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Create Task Group</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="form-group">
                          <label htmlFor="emailId">Task Group</label>
                          <input type="email" className="form-control" id="groupname" onChange={this.taskGroup} />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Create</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>);
        }
        else {
            return (<div></div>);
        }
    }

    handleSubmit() {
        if (this.state.group != "") {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                }
            };
            axios.post('/api/v1/users/' + JSON.parse(window.localStorage.getItem('user')).id + '/taskgroups', {
                "taskGroupName": this.state.group
            }, axiosConfig)
            .then((response) => {
                console.log(response);
            });
        }
    }
}

ReactDOM.createRoot(document.getElementById("creategroup")).render(<PostTaskGroups />);
