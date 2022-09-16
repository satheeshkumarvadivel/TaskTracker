class GetTaskGroups extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: []
        };
    }

    componentDidMount() {
        let axiosConfig = {
                    headers: {
                      'Content-Type': 'application/json;charset=UTF-8',
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

    render() {
        return (<select id="inputState" className="form-control" defaultValue="2">{this.state.groups.map(item => <option key={item.value}>{item.label}</option>)}</select>);
    }
}

ReactDOM.createRoot(document.getElementById("root")).render(<GetTaskGroups />);
