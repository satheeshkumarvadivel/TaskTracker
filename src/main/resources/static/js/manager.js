class Manager extends React.Component {
    state = {
        managerdetails: []
    };

    constructor(props) {
        super(props);

        this.previousweek = this.previousweek.bind(this);
        this.nextweek = this.nextweek.bind(this);
        this.state = {
            prvcount: 0,
            week_start_date:'',
            week_end_date:'',
            current_week_start_date:'',
            current_week_end_date:'',
            managerdetails:[]
       }
    }

    componentWillMount() {
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

//        const date = new Date(now);
        let week_start = new Date(dates[0].split('-')[0],dates[0].split('-')[1]-1,dates[0].split('-')[2]);
        let week_end = new Date(dates[4].split('-')[0],dates[4].split('-')[1]-1,dates[4].split('-')[2])
        this.setState({ week_start_date: week_start })
        this.setState({ week_end_date: week_end })

        this.setState({ current_week_start_date: week_start })
        this.setState({ current_week_end_date: week_end })

        console.log(week_end)
        console.log(week_start)

        console.log( dates[0])
        console.log( dates[4])
    }

    componentDidMount() {
        this.loadData(this.state.current_week_start_date, this.state.current_week_end_date)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.week_start_date != nextState.week_start_date) && (this.state.week_end_date != nextState.week_end_date);
    }

    componentDidUpdate() {
        console.log(this.state.week_start_date)
        console.log(this.state.week_end_date)
        this.loadData(this.state.week_start_date, this.state.week_end_date)
    }

    loadData(week_monday, week_friday) {
        Date.prototype.toShortFormat = function() {

                    let day = this.getDate();
                    let monthIndex = this.getMonth();
                    let year = this.getFullYear();

                    console.log(year + '-' + (monthIndex + 1) + '-' + day)
                    return year + '-' + (monthIndex + 1) + '-' + day;
                }

        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            }
        };
        axios.get('/api/v1/users/1/teamtasks?toDate='+new Date(week_friday).toShortFormat()+'&fromDate='+ new Date(week_monday).toShortFormat(), axiosConfig)
            .then((res) => {
                console.log(res.data)
                this.setState({
                    managerdetails: res.data
                });
            })
            .catch((err) => {
                console.log(err)
            })

        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }

        var dateArray = new Array();
        var currentDate = new Date(week_monday);
        while (currentDate <= new Date(week_friday)) {
            dateArray.push(new Date(currentDate).toShortFormat());
            currentDate = currentDate.addDays(1);
        }

        ReactDOM.render(<tr>
                            <th scope="col">Name</th>
                            {dateArray.map(day => <th key={day} scope="col">{day}</th>)}
                        </tr>, document.getElementById("header"));
    }

    previousweek(event) {

        console.log(this.state.managerdetails);

        var count=this.state.prvcount + 1
        this.setState({ prvcount: count })
        var prv_week_count = count*7
        let today = new Date();
        let day = today.getDay();
        let t = day-1;
        let monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - t - prv_week_count);

        var get_week_start = monday
//        console.log(get_week_start)
        this.setState({ week_start_date: get_week_start })

        var get_week_end = calcWorkingDays(monday,4)

        this.setState({ week_end_date: get_week_end })
//        console.log(get_week_end)

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
//        console.log(this.state.week_start_date)
//        console.log(this.state.week_end_date)
//        this.loadData(get_week_start, get_week_end)
    }

    nextweek(event){

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
//                console.log(future_end_week)

            if(future_end_week > this.state.current_week_end_date) {
                alert("You can't go future week....!")
//            wrtie axio post
//            this.setState({ week_start_date: this.state.current_week_start_date }
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
                this.setState({ week_start_date: get_start_date })
                this.setState({ week_end_date: get_end_date })
                console.log(get_start_date);
                console.log(get_end_date);
//                this.loadData(get_start_date, get_end_date)
            }
        }
    }

    render(){

        return <div>
        <div className="home-container">
            <nav className="navbar">
                <h3 >EasyStatus</h3>
                <div className="dropdown">
                    <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown"
                    aria-expanded="false">
                    Satheeshkumar
                    </a>

                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <a className="dropdown-item" href="home.html">My Tasks</a>
                    <a className="dropdown-item" href="manager.html">Team Tasks</a>
                    <a className="dropdown-item" href="index.html">Logout</a>
                </div>
            </div>
        </nav>
        <div className="task-table-container">
            <div className="task-table-control-bar">
                <form className="col-8">
                    <div className="form-row justify-content-between">
                        <button type="button" className="btn btn-primary col-1" onClick={this.previousweek} > &lt;&lt; </button>
                        <div id="taskgrouplist" className="col col-3">
                        </div>
                        <div className="col col-lg-5">
                            <input type="text" className="form-control" placeholder="Search" />
                        </div>
                        <button type="button" className="btn btn-primary col-1" onClick={this.nextweek}> &gt;&gt; </button>
                    </div>
                </form>
            </div>
            <table className="table table-sm table-bordered">
                <thead id="header" className="thead-light"></thead>
                <tbody id="body">
                    <tr>
                        <th scope="row" className="align-middle">Satheeshkumar</th>
                        <td className="align-middle">
                            <div className="list-group">
                                <button type="button" draggable="true"
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.<span
                                        className="badge badge-secondary badge-pill">CALL-33101</span>
                                </button>
                                <button type="button" draggable="true"
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">Discussion
                                    with Jahirul on SMS-GW API implementation.<span
                                        className="badge badge-secondary badge-pill">BEMS</span></button>
                                <button type="button" draggable="true"
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">Worked
                                    on PROVISION-9958<span
                                        className="badge badge-secondary badge-pill">PST</span></button>
                                <button type="button" draggable="true"
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center danger-border">Discussion
                                    with Jahirul on SMS-GW API implementation.<span
                                        className="badge badge-secondary badge-pill">CALL-33101</span></button>
                                <button type="button" draggable="true"
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">Worked
                                    on PROVISION-9958<span
                                        className="badge badge-secondary badge-pill">CALL-33101</span>
                                </button>
                                <button type="button" draggable="true" data-toggle="modal" data-target="#addTaskModal"
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center add-task">
                                    <span> + Add Task </span>
                                </button>
                            </div>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action list-group-item list-group-item-secondary d-flex justify-content-between align-items-center">
                                    <strong>PTO</strong><span
                                        className="badge badge-success badge-pill pto-badge">Applied</span>
                                </li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <div className="list-group">
                                <button type="button" draggable="true"
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.<span
                                        className="badge badge-secondary badge-pill">BEMS</span></button>
                                <button type="button" draggable="true"
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958<span
                                        className="badge badge-secondary badge-pill">BEMS</span>
                                </button>
                                <button type="button" draggable="true" data-toggle="modal" data-target="#addTaskModal"
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center add-task">
                                    <span> + Add Task</span>
                                </button>

                            </div>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.<span
                                        className="badge badge-secondary badge-pill">BEMS</span></li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958<span
                                        className="badge badge-secondary badge-pill">CALL-33101</span></li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.<span
                                        className="badge badge-secondary badge-pill">BEMS</span></li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958<span
                                        className="badge badge-secondary badge-pill">BEMS</span>
                                </li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.<span
                                        className="badge badge-secondary badge-pill">BEMS</span></li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.<span
                                        className="badge badge-secondary badge-pill">BEMS</span></li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958<span className="badge badge-secondary badge-pill">GC</span>
                                </li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.<span
                                        className="badge badge-secondary badge-pill">CALL-33101</span></li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Worked on PROVISION-9958<span
                                        className="badge badge-secondary badge-pill">BEMS</span>
                                </li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.<span
                                        className="badge badge-secondary badge-pill">BEMS</span></li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" className="align-middle">Rahul</th>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.<span
                                        className="badge badge-secondary badge-pill">CALL-69090</span></li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958<span
                                        className="badge badge-secondary badge-pill">PST</span>
                                </li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.<span
                                        className="badge badge-secondary badge-pill">GC</span></li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.<span
                                        className="badge badge-secondary badge-pill">BEMS</span></li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.<span
                                        className="badge badge-secondary badge-pill">BEMS</span></li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958<span
                                        className="badge badge-secondary badge-pill">PST</span>
                                </li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.<span
                                        className="badge badge-secondary badge-pill">PST</span></li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action list-group-item list-group-item-secondary d-flex justify-content-between align-items-center">
                                    <strong>PTO</strong><span
                                        className="badge badge-warning badge-pill pto-badge">Pending</span>
                                </li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.<span
                                        className="badge badge-secondary badge-pill">CALL-69090</span></li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958<span
                                        className="badge badge-secondary badge-pill">PST</span>
                                </li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <li
                                className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                Discussion with Jahirul on SMS-GW API implementation.<span
                                    className="badge badge-secondary badge-pill">BEMS</span></li>
                            <li
                                className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                Discussion with Jahirul on SMS-GW API implementation.<span
                                    className="badge badge-secondary badge-pill">BEMS</span></li>
                            <li
                                className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                Worked on PROVISION-9958<span className="badge badge-secondary badge-pill">PST</span>
                            </li>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" className="align-middle">John</th>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.<span
                                        className="badge badge-secondary badge-pill">BEMS</span></li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" className="align-middle">Shinjani</th>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" className="align-middle">Sudhagar</th>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row" className="align-middle">Santosh</th>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center primary-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                        <td className="align-middle">
                            <ul className="list-group">
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Attend CALL-69090 scrum meeting.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Discussion with Jahirul on SMS-GW API implementation.</li>
                                <li
                                    className=" list-group-item list-group-item-action d-flex justify-content-between align-items-center success-border">
                                    Worked on PROVISION-9958</li>
                            </ul>
                        </td>
                    </tr>
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

const App = () => {
    return (
        <div>
            <Manager />
        </div>
        )

};

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />);