import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://localhost:5000/api/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  };

  const addTodo = () => {
    axios.post('http://localhost:5000/api/todos', { text, is_completed: false })
      .then(response => {
        setTodos([...todos, response.data]);
        setText('');
      })
      .catch(error => {
        console.error('Error adding todo:', error);
      });
  };

  const updateTodo = (id, newText, newIsCompleted) => {
    axios.put(`http://localhost:5000/api/todos/${id}`, { text: newText, is_completed: newIsCompleted })
      .then(response => {
        const updatedTodos = todos.map(todo => {
          if (todo.id === id) {
            return response.data;
          }
          return todo;
        });
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`)
      .then(response => {
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter a new todo"
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="text"
              value={todo.text}
              onChange={e => updateTodo(todo.id, e.target.value, todo.is_completed)}
            />
            <input
              type="checkbox"
              checked={todo.is_completed}
              onChange={e => updateTodo(todo.id, todo.text, e.target.checked)}
            />
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;