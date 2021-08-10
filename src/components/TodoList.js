import React, { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import axios from 'axios';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { Button } from '@material-ui/core';
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = async todo => {
    if (!todo.todo_text || /^\s*$/.test(todo.todo_text)) {
      return;
    }
   await axios.post("/todos",{
      "todo_text":todo.todo_text
    })
    await axios.get(`/getTodos`).then(res => setTodos(res.data)) 
    };
  
    useEffect(()=>{
    axios.get(`/getTodos`).then(res => setTodos(res.data))
    },[])
    console.log(todos)
    const updateTodo = (todoId, newValue) => {
    if (!newValue.todo_text || /^\s*$/.test(newValue.todo_text)) {
      return;
    }
    axios.post('/update',{"id":todoId,"todo_text":newValue.todo_text})
    axios.get(`/getTodos`).then(res => setTodos(res.data)) 
    };

    const removeTodo = id => {
    const removedArr = [...todos].filter(todo => todo._id !== id);
    axios.post('/delete',{"id":id});
    setTodos(removedArr);
  };

  const completeTodo = id => {
    let updatedTodos = todos.map(todo => {
      if (todo._id === id) {
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
      <div className="navigation_buttons">
      <button className="btn_next">Prev</button>
      <button className="btn_next">Next</button>
      </div>
     

    </>
  );
}

export default TodoList;
