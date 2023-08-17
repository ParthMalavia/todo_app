import './App.css';
import React from 'react';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            activeItem: {
                id: null,
                title: '',
                is_completed: false
            },
            editing: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.startEdit = this.startEdit.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.strikeunstrike = this.strikeunstrike.bind(this)
    };

    fetchTasks() {
        fetch("http://localhost:8000/api/task-list/")
        .then(response => response.json())
        .then(data => this.setState({todoList: data}))
    }

    handleChange(e) {
        // var name = e.target.name
        var value = e.target.value;
        this.setState({
            activeItem:{
                ...this.state.activeItem,
                title: value
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        var url = "http://localhost:8000/api/task-create/"
        if (this.state.editing) {
            url = `http://localhost:8000/api/task-update/${this.state.activeItem.id}/`
            this.setState({
                editing: false
            })
        }
        fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(this.state.activeItem)
        }).then((response) => {
            this.fetchTasks()
            this.setState({
                activeItem: {
                    id: null,
                    title: '',
                    is_completed: false
                }
            })
        }).catch((error) => {
            console.log("ERROR:", error)
        })
    }

    startEdit(task) {
        this.setState({
            activeItem: task,
            editing: true
        })
    }

    deleteItem(task) {
        fetch(`http://localhost:8000/api/task-delete/${task.id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            this.fetchTasks()
        })
    }

    strikeunstrike(task) {
        task.is_completed = !task.is_completed
        fetch(`http://localhost:8000/api/task-update/${task.id}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({title: task.title, is_completed: task.is_completed})
        }).then((res) => {
            this.fetchTasks()
        })

        console.log(task)
    }

    componentDidMount() {
        this.fetchTasks();
    }

    render() {
        var tasks = this.state.todoList
        var self = this
        return (
            <div className='container'>
                <div id='task-container'>
                    <div id='form-wrapper'>
                        <form id="form" onSubmit={this.handleSubmit}>
                            <div className="flex-wrapper">
                                <div style={{ flex: 6 }}>
                                    <input type="text" onChange={this.handleChange} name="title" id="title" value={this.state.activeItem.title} className="form-control" placeholder='Add Task' />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input type="submit" name="Add" className="btn btn-warning" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id='list-wrapper'>
                        {tasks.map(function(task, index) {
                            return(
                                <div key={index} className='task-wrapper flex-wrapper'>

                                    <div onClick={() => self.strikeunstrike(task)} style={{flex: 7}}>
                                        {task.is_completed === false ? (
                                            <span>{task.title}</span>
                                        ) : (
                                            <strike>{task.title}</strike>
                                        ) }
                                    </div>
                                    <div style={{flex: 1}}><button onClick={() => self.startEdit(task)} className='btn btn-sm btn btn-outline-info'>Edit</button></div>
                                    <div style={{flex: 1}}><button onClick={() => self.deleteItem(task)} className='btn btn-sm btn btn-outline-dark delete'>-</button></div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
