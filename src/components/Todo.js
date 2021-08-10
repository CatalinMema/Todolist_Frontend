import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

const Todo = ({ todos, completeTodo, removeTodo, updateTodo }) => {
  const [edit, setEdit] = useState({
    id: null,
    value: ''
  });

  const submitUpdate = value => {
    console.log(edit.id)
    console.log(value)
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: ''
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return todos.map((todo, index) => (
    <div
      className={todo.isComplete ? 'todo-row complete' : 'todo-row'}
      key={index}
    >
      <div className="todo_text" key={todo._id} onClick={() => completeTodo(todo._id)}>
        {todo.todo_text}
      </div>
      <div className='icons'>
        <RiCloseCircleLine
          onClick={() => removeTodo(todo._id)}
          className='delete-icon'
        />
        <TiEdit
          onClick={() => setEdit({ id: todo._id, value: todo.todo_text })}
          className='edit-icon'
        />
      </div>
    </div>
  ));
};

export default Todo;
