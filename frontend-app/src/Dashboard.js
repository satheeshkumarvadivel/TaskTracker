import React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route,Link } from 'react-router-dom';
import axios from 'axios';
import './css/bootstrap.css';
import GetTaskGroups from './GetTaskGroups';
import PostTaskGroups from './PostTaskGroups';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/js/dist/modal.js';
import  LogoutDropdown from './LogoutDropdown';
class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.previousweek = this.previousweek.bind(this);
        this.nextweek = this.nextweek.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.getTaskData = this.getTaskData.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDropdownChangeTaskStatus = this.handleDropdownChangeTaskStatus.bind(this);
        this.handletaskDetail = this.handletaskDetail.bind(this);
        this.doSomething = this.doSomething.bind(this);
        this.toggleShow = this.toggleShow.bind(this);
        this.hide = this.hide.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
        this.handleDropdowndate = this.handleDropdowndate.bind(this);
        this.state = {
            prvcount: 0,
            specificUserId: JSON.parse(localStorage.getItem("user")).id,
            week_start_date: '',
            week_end_date: '',
            current_week_start_date: '',
            current_week_end_date: '',
            managerdetails:[],
            taskData: {},
            userData: {},
            dateArray: [],
            TaskselectValue:"",
            TaskGroupSelectValue:"",
            TaskDetail:"",
            isOpen: false,
            show: false,
            Date:''
        }

        Date.prototype.toShortFormat = function() {
            let day = this.getDate();
            let monthIndex = this.getMonth();
            let year = this.getFullYear();
            return year + '-' + (monthIndex + 1) + '-' + day;
        }

        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }


    }

    doSomething(e){
        e.preventDefault();
        console.log(e.target.innerHTML);
      }

      toggleShow(){
        this.setState({show: !this.state.show});
      }

      hide(e){
        if(e && e.relatedTarget){
          e.relatedTarget.click();
        }
        this.setState({show: false});
      }

    handleDropdownChange(e) {
        this.setState({ TaskGroupSelectValue: e.target.value });
      }
     handleDropdowndate(e){
        this.setState({ Date: e.target.value });
     }

     handleDropdownChangeTaskStatus(e){
     this.setState({TaskselectValue:e.target.value});
     }

     handletaskDetail(e){
     this.setState({TaskDetail:e.target.value});
     }

    async componentWillMount() {
        const dates=[]
        const name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const now = Date.now();
        const DAY = 60 * 60 * 24 * 1000;
        const today = new Date(now).getDay();

        for (let i = today; i >= 0; i--) {
            const date = new Date(now - DAY * i);
        	if(name[date.getDay()] != 'Sun') {
        	    dates.push(date.getFullYear()+'-'+(date.getMonth()+1) +'-'+date.getDate())
        	}
        }

        for (let i = 1; i < 7 - today; i++) {
            const date = new Date(now + DAY * i);
            if(name[date.getDay()] != 'Sat'){
        	    dates.push(date.getFullYear()+'-'+(date.getMonth()+1 )+'-'+date.getDate())
        	}
        }

        let week_start = new Date(dates[0].split('-')[0],dates[0].split('-')[1]-1,dates[0].split('-')[2]);
        let week_end = new Date(dates[4].split('-')[0],dates[4].split('-')[1]-1,dates[4].split('-')[2]);

        this.setState({
            dateArray: this.getDateArray(week_start, week_end),
            userData: await this.getUserData(week_start, week_end),
            taskData: await this.getTaskData(week_start, week_end),
            week_start_date: week_start,
            week_end_date: week_end,
            current_week_start_date: week_start,
            current_week_end_date: week_end
        })
    }

    getDateArray = (week_monday, week_friday) => {
        // Function logic using arg1 and arg2
        var dateArray = new Array();
        var currentDate = new Date(week_monday);
        while (currentDate <= new Date(week_friday)) {
            dateArray.push(new Date(currentDate).toShortFormat());
            currentDate = currentDate.addDays(1);
        }
        return dateArray
    };

    shouldComponentUpdate(nextProps, nextState) {
        console.log("Inside shouldComponentUpdate")
        return (this.state.week_start_date != nextState.week_start_date) && (this.state.week_end_date != nextState.week_end_date);
    }

    getUserData = async (week_monday, week_friday) => {
        const userData = {};

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        };

        try {
            const res = await axios.get('/api/v1/users', axiosConfig);
            console.log(res.data)
            for (const user of res.data) {
                userData[user.id] = user.fname + ' ' + user.lname;
            }
        } catch(err) {
            console.log(err)
        }

        return userData;
    }

    getTaskData = async (week_monday, week_friday) => {
        const taskData = {};

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        };

        try {
            const res = await axios.get('/api/v1/users/1/teamtasks?toDate='+new Date(week_friday).toShortFormat()+'&fromDate='+ new Date(week_monday).toShortFormat(), axiosConfig)
            console.log(res.data)

            for (let i = 0; i < Object.keys(res.data).length; i++) {
                var entry = Object.values(res.data)[i]

                for (let j = 0; j < entry.tasks.length; j++) {
                    var task = entry.tasks[j]
                    var dom_id = new Date(task.createdDate).toShortFormat() + "-" + entry.id;
                    console.log(dom_id);

                    if (!taskData[dom_id]) {
                        taskData[dom_id] = [];
                    }

                    taskData[dom_id].push({
                        taskDetail: task.taskDetail,
                        taskGroup: task.taskGroup,
                        userId: task.userId
                    });
                }
            }
        }
        catch(err) {
            console.log(err)
        }

        return taskData;
    }

    async previousweek(event) {
        var count=this.state.prvcount + 1
        this.setState({ prvcount: count })
        var prv_week_count = count*7
        let today = new Date();
        let day = today.getDay();
        let t = day-1;
        let monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - t - prv_week_count);

        var get_week_start = monday
        var get_week_end = calcWorkingDays(monday,4)

        function calcWorkingDays(fromDate, days) {
            var count = 0;
            var tempDate = new Date(fromDate)
            while (count < days) {
                tempDate.setDate(tempDate.getDate() + 1);
                if (tempDate.getDay() != 0 && tempDate.getDay() != 6) // Skip weekends
                    count++;
            }
            return tempDate;
        }

        this.setState({
            week_start_date: get_week_start,
            week_end_date: get_week_end,
            dateArray: this.getDateArray(get_week_start, get_week_end),
            userData: await this.getUserData(get_week_start, get_week_end),
            taskData: await this.getTaskData(get_week_start, get_week_end)
        })
    }

    async nextweek(event){

        var count=this.state.prvcount
        if(this.state.prvcount != 0){
            count=count- 1
        }
        this.setState({ prvcount: count })

        if(this.state.week_end_date == this.state.current_week_end_date) {
            alert("You can't go future week.............!");
        }
        else {
            let fut_end_date = new Date(this.state.week_end_date);
            let days = fut_end_date.getDay();
            let tt = days-5;
            let future_end_week = new Date(fut_end_date.getFullYear(), fut_end_date.getMonth(), fut_end_date.getDate() - tt + 7);

            if(future_end_week > this.state.current_week_end_date) {
                alert("You can't go future week....!")
            }
            else {
                let today = new Date(this.state.week_start_date);
                let day = today.getDay();
                let t = day-1;
                let future_start_week = new Date(today.getFullYear(), today.getMonth(), today.getDate() - t + 7);

                let fut_end_date = new Date(this.state.week_end_date);
                let days = fut_end_date.getDay();
                let tt = days-5;

                var get_start_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - t + 7)
                var get_end_date = new Date(fut_end_date.getFullYear(), fut_end_date.getMonth(), fut_end_date.getDate() - tt + 7)

                this.setState({
                    week_start_date: get_start_date,
                    week_end_date: get_end_date,
                    dateArray: this.getDateArray(get_start_date, get_end_date),
                    userData: await this.getUserData(get_start_date, get_end_date),
                    taskData: await this.getTaskData(get_start_date, get_end_date)
                })
            }
        }
    }


    toggleOpen (){
     this.setState({ isOpen: !this.state.isOpen });
     console.log(this.state.isOpen)
    }

    handleSubmit(){
      var selectTaskvalue=this.state.TaskGroupSelectValue
      var res = this.state.groups.filter(function(item) {
            if(item.label == selectTaskvalue){
            return item.value
            }
        });
       console.log(res)
       if(this.state.TaskDetail  && this.state.TaskDetail && this.state.Date  && this.state.TaskselectValue && res[0].value ){
       let axiosConfig = {
           headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer window.localStorage.getItem('token')`
                 }
            };
            axios.post('/api/v1/users/' + JSON.parse(window.localStorage.getItem('user')).id + '/tasks',
                   {"taskGroupId": res[0].value,
                   "taskDetail":this.state.TaskDetail,
                   "taskStatus":this.state.TaskselectValue,
                   "createdDate": this.state.Date
                   },axiosConfig)
                       .then((response) => {
                           console.log(response)
                           alert("Task successfully Instered...!")
                       }
                   );
         }else{
            alert("Please enter the value for all fields..!")
         }
    }

    componentDidMount(){
    let axiosConfig = {
                        headers: {
                          'Content-Type': 'application/json;charset=UTF-8',
                          'Authorization': `Bearer window.localStorage.getItem('token')`
                        }
                    };
            axios.get('/api/v1/users/' + JSON.parse(window.localStorage.getItem('user')).id + '/taskgroups')
                .then((response) => {
                    var arr = []
                    response.data.forEach(obj => {
                        arr.push({value: obj.id, label: obj.groupName});
                    });
                    this.setState({ groups: arr });
                }
            );
    }

    render(){
        console.log("***************")
        console.log(this.state.dateArray);
        console.log(this.state.userData);
        console.log(this.state.taskData);
        console.log("start = " + this.state.week_start_date);
        console.log("end = " + this.state.week_end_date);
        console.log(this.state.show)
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
        console.log(menuClass)
        return <div>
            <div className="home-container">
                <nav className="navbar">
                    <h3 >EasyStatus</h3>
                    <LogoutDropdown/>

                </nav>
                <div className="task-table-container">
                    <div className="task-table-control-bar">
                        <form className="col-8">
                            <div className="form-row flex-nowrap justify-content-between">
                                <button type="button" className="btn btn-primary col-1" onClick={this.previousweek} > &lt;&lt; </button>
                                <div id="taskgrouplist" className="col col-3">
                                    <GetTaskGroups/>
                                </div>
                                <div id="creategroup">
                                    <PostTaskGroups/>
                                </div>
                                <div className="col col-lg-5">
                                    <input type="text" className="form-control" placeholder="Search" />
                                </div>
                                <button type="button" className="btn btn-primary col-1" onClick={this.nextweek}> &gt;&gt; </button>
                            </div>
                        </form>
                    </div>

                    <table className="table table-sm table-bordered">

                        {/* Render Calender Header */}
                        <thead id="header" className="thead-light">
                            <tr>
                                <th scope="col">Name</th>
                                {this.state.dateArray.map(day => <th key={day} scope="col">{day}</th>)}
                            </tr>
                        </thead>

                        {/* Render Table Body */}
                        <tbody id="body">
                            <>
                                {/* Render the specific user first */}
                                <tr>
                                    <th scope="row" className="align-middle" key={this.state.specificUserId}>{this.state.userData[this.state.specificUserId]}</th>
                                    {this.state.dateArray.map(day =>
                                        <td className="align-middle" key={`${day}-${this.state.specificUserId}`}>
                                            <ul className="list-group task-cell">
                                                {this.state.taskData[`${day}-${this.state.specificUserId}`] && this.state.taskData[`${day}-${this.state.specificUserId}`].map((task, index) =>
                                                    <li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                                        {task.taskDetail}
                                                        <span className="badge badge-secondary badge-pill">{task.taskGroup}</span>
                                                    </li>
                                                )}

                                                {/* Add Task option for current user alone */}
                                                <li type="button" draggable="true" data-toggle="modal" data-bs-toggle="modal" data-bs-target="#exampleModal" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center add-task">
                                                    + Add Task
                                                </li>
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
                                                                    <select id="inputState" className="form-control" onChange={this.handleDropdownChange}  defaultValue="2"> <option defaultValue value="Select">Select</option> {this.state.groups.map(item => <option key={item.value} >{item.label}</option>)}</select>
                                                                  </div>
                                                                  <div className="form-group">
                                                                      <label htmlFor="taskDetail">TaskDetail</label>
                                                                      <input type="text" className="form-control" onChange={this.handletaskDetail}  id="taskDetail"/>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="taskStatus">Task Status</label>
                                                                         <select id="TaskStatus" onChange={this.handleDropdownChangeTaskStatus} className="form-control">
                                                                           <option defaultValue value="Select">Select</option>
                                                                           <option  value="INPROGRESS">INPROGRESS</option>
                                                                           <option value="COMPLETED">COMPLETED</option>
                                                                           <option value="BLOCKED">BLOCKED</option>
                                                                           </select>
                                                                    </div>

                                                                    <div className="form-group">
                                                                     <label htmlFor="taskStatus">Date</label>
                                                                     <select id="TaskStatus" onChange={this.handleDropdowndate} className="form-control">
                                                                     <option defaultValue value="Select">Select</option>
                                                                    {this.state.dateArray.map(item => <option  key={item} >{item}</option>)}
                                                                    </select>
                                                                  </div>

                                                                </div>
                                                                <div className="modal-footer">
                                                                  <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Create</button>
                                                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                            </ul>
                                        </td>
                                    )}
                                </tr>

                                {/* Render the remaining users */}
                                {Object.entries(this.state.userData).filter(([myuserid, user]) => myuserid !== this.state.specificUserId.toString()).map(([userid, user]) =>
                                    <tr>
                                        <th scope="row" className="align-middle" key={userid}>{user}</th>
                                        {this.state.dateArray.map(day =>
                                            <td className="align-middle" key={`${day}-${userid}`}>
                                                <ul className="list-group task-cell">
                                                    {this.state.taskData[`${day}-${userid}`] && this.state.taskData[`${day}-${userid}`].map((task, index) =>
                                                        <li className="list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                                            {task.taskDetail}
                                                            <span className="badge badge-secondary badge-pill">{task.taskGroup}</span>
                                                        </li>)
                                                    }
                                                </ul>
                                            </td>)
                                        }
                                    </tr>)
                                }
                            </>
                        </tbody>
                    </table>

                    <div className="modal fade" tabIndex="-1" role="dialog" id="addTaskModal">
                        <div className="modal-dialog  modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Task</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-row">
                                            <div className="col">
                                                <label htmlFor="taskDetails">Task Details</label>
                                                <input type="text" className="form-control" id="taskDetails" />
                                            </div>
                                        </div> <br />
                                        <div className="form-row">
                                            <div className="col">
                                                <select id="addTaskType" className="form-control">
                                                    <option defaultValue value="1">Team Status</option>
                                                    <option value="1">BEMS</option>
                                                    <option value="1">PST</option>
                                                    <option value="1">CALL-33101</option>
                                                    <option value="1" >CALL-69090</option>
                                                </select>
                                            </div>
                                            <div className="col">
                                                <select id="addTaskType" className="form-control">
                                                    <option defaultValue  value="1">Completed</option>
                                                    <option  value="1">In Progress</option>
                                                    <option  value="1">Blocked</option>
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary">Add</button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;

    }
}

export default Dashboard;