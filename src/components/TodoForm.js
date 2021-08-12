import React, { useState, useEffect, useRef } from 'react';
import {ADD_TODO, UPDATE,UPDATE_TODO} from '../utils/constants';

function TodoForm({edit,onChangeSetDate,onSubmit,dateOfTodo}) {
  const [input, setInput] = useState(edit ? edit.value : '');
  const [inputdate, setInputDate] = useState(dateOfTodo);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  });
  
 
   
  const handleChange = e => {
    setInput(e.target.value);
  };

  const handleDateChange = e => {
    setInputDate(e.target.value);
    onChangeSetDate(e.target.value);
  };
  
  const handleSubmit = e => {
    e.preventDefault();

    onSubmit({
      todo_text: input,
      date_todo: inputdate
    });
//     axios.post("/todos",{
//       "todo_text":input
//  })
    setInput('');
  };
  
  return (
    <form onSubmit={handleSubmit} className='todo-form'>
      {edit ? (
        <>
          <input
            placeholder={UPDATE_TODO}
            value={input}
            onChange={handleChange}
            name='text'
            ref={inputRef}
            className='todo-input-update edit'
          />
          <button onClick={handleSubmit} className='todo-button edit'>
            {UPDATE}
          </button>
        </>
      ) : (
        <div className="add_todo_container">
          <div>
          <input
            placeholder={ADD_TODO}
            value={input}
            onChange={handleChange}
            name='text'
            className='todo-input'
            ref={inputRef}
          />
          </div>
          <div className="todo_buttons">
          {/* <button className='todo-button'>
            {DATE}
          </button> */}
          <input type="date" className='date_input'
          value={inputdate}
          onChange={handleDateChange}
          
       />

          <br />
          <button onClick={handleSubmit} className='todo-button'>
            {ADD_TODO}
          </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default TodoForm;
