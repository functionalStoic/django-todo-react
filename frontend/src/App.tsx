import React, { Component } from 'react';
import Modal from './components/Modal';
import axios from 'axios';

type item = {
  id: number;
  completed: boolean;
  description: string;
  title: string;
};
class App extends Component {
  state = {
    viewCompleted: false,
    activeItem: {
      title: '',
      description: '',
      completed: false,
    },
    todoList: [],
    modal: false,
  };

  componentDidMount = () => {
    this.refreshList();
  };

  refreshList = () => {
    axios
      .get('http://localhost:8000/api/todos/')
      .then(res => this.setState({ todoList: res.data }))
      .catch(error => console.log(error));
  };

  displayCompleted = (status: boolean) =>
    this.setState({ viewCompleted: status });

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? 'active' : ''}
        >
          complete
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? '' : 'active'}
        >
          Incomplete
        </span>
      </div>
    );
  };
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item: item) => item.completed === viewCompleted,
    );
    return newItems.map((item: item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? 'completed-todo' : ''
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-secondary mr-2"
          >
            {' '}
            Edit{' '}
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            Delete{' '}
          </button>
        </span>
      </li>
    ));
  };
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };
  handleSubmit = (item: item) => {
    this.toggle();
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/todos/${item.id}/`, item)
        .then(res => this.refreshList());
      return;
    }
    axios
      .post('http://localhost:8000/api/todos/', item)
      .then(res => this.refreshList());
  };
  handleDelete = (item: item) => {
    axios
      .delete(`http://localhost:8000/api/todos/${item.id}`)
      .then(res => this.refreshList());
  };
  createItem = () => {
    const item = { title: '', description: '', completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  editItem = (item: item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  render() {
    return (
      <main className="content">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} className="btn btn-primary">
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}
export default App;
