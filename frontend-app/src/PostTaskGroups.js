import React, { useState } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/js/dist/modal.js';

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

  handleSubmit() {
    if (this.state.group !== '') {
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`
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

  render() {
    if (JSON.parse(window.localStorage.getItem('user')).isManager === 'Y') {
      return (
        <div>
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <i className="fas fa-plus" aria-hidden="true"></i>
          </button>

          <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Task Group</h5>
                  <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="groupname">Task Group</label>
                    <input type="text" className="form-control" id="groupname" onChange={this.taskGroup} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Create</button>
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (<div></div>);
    }
  }
}

export default PostTaskGroups;
