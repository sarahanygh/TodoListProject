import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoText, setEditedTodoText] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://localhost:5000/api/todos')
      .then(response => {
        setTodos(response.data.todos);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  };

  const addTodo = () => {
    axios.post('http://localhost:5000/api/todos', { text: newTodoText, is_completed: false })
      .then(response => {
        setTodos([...todos, response.data]);
        setNewTodoText('');
      })
      .catch(error => {
        console.error('Error adding todo:', error);
      });
  };

  const updateTodoText = (id, newText) => {
    axios.put(`http://localhost:5000/api/todos/${id}`, { text: newText })
      .then(response => {
        const updatedTodos = todos.map(todo => {
          if (todo.id === id) {
            return { ...todo, text: newText };
          }
          return todo;
        });
        setTodos(updatedTodos);
        //setEditingTodoId(null); // Exit edit mode after updating
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  };

  const toggleComplete = (id, isCompleted) => {
    axios.put(`http://localhost:5000/api/todos/${id}`, { is_completed: !isCompleted })
      .then(response => {
        const updatedTodos = todos.map(todo => {
          if (todo.id === id) {
            return { ...todo, is_completed: !isCompleted };
          }
          return todo;
        });
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error('Error toggling todo completion:', error);
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

  const handleEditClick = (id, text) => {
    setEditingTodoId(id);
    setEditedTodoText(text);
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodoText}
        onChange={e => setNewTodoText(e.target.value)}
        placeholder="Enter a new todo"
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {editingTodoId === todo.id ? (
              <div>
                <input
                  type="text"
                  value={todo.text}
                  onChange={e => updateTodoText(todo.id, e.target.value)}
                />
                <button onClick={() => setEditingTodoId(null)}>Done</button>
              </div>
            ) : (
              <div>
                <span className={todo.is_completed ? 'completed' : ''}>{todo.text}</span>
                <input
                  type="checkbox"
                  checked={todo.is_completed}
                  onChange={() => toggleComplete(todo.id, todo.is_completed)}
                />
                <button onClick={() => handleEditClick(todo.id, todo.text)}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
