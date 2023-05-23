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

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.previousweek = this.previousweek.bind(this);
        this.nextweek = this.nextweek.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.getTaskData = this.getTaskData.bind(this);

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
            dateArray: []
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

//    async componentDidUpdate() {
//        console.log("Inside componentDidupdate")
//        this.setState({
//            dateArray: this.getDateArray(this.state.week_start_date, this.state.week_end_date),
//            userData: await this.getUserData(this.state.week_start_date, this.state.week_end_date),
//            taskData: await this.getTaskData(this.state.week_start_date, this.state.week_end_date)
//        })
//    }

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

    render(){
        console.log("***************")
        console.log(this.state.dateArray);
        console.log(this.state.userData);
        console.log(this.state.taskData);
        console.log("start = " + this.state.week_start_date);
        console.log("end = " + this.state.week_end_date);

        return <div>
            <div className="home-container">
                <nav className="navbar">
                    <h3 >EasyStatus</h3>

                    <div className="dropdown">
                          <a
                            className="dropdown-toggle"
                            href="#"
                            role="button"
                            id="dropdownMenuLink"
                            data-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {JSON.parse(localStorage.getItem("user")).fname}
                          </a>

                          <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <a className="dropdown-item" href="index.html">Logout</a>
                          </div>
                        </div>
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
                                                <li type="button" draggable="true" data-toggle="modal" data-target="#addTaskModal" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center add-task">
                                                    + Add Task
                                                </li>
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