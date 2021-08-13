import React from 'react'
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';
function Todos({todos,removeTodo,setEdit,completeTodo,dateOfTodo}) {
    const todosList = todos.map((todo, index) => (
        <div
          className={todo.completed_todo ? 'todo-row complete' : 'todo-row'}
          key={index}
        >
          <div className="todo_text" key={todo._id} onClick={() => completeTodo(todo._id,todo.completed_todo)}>
            {/* <h4> {truncate(todo.todo_text,40)}</h4> */}
           
            {todo.todo_text.length>54 ? ( <h4 className="txt_todo" >
          {todo.todo_text} 
          </h4>) : (
          <div style={{flex:'0.98',display:'flex',justifyContent:'space-between'}}>
    
          <h4 className={todo.completed_todo ? 'completeLine' : null}>{todo.todo_text} </h4>
          {dateOfTodo!=="All" ? (<></>) : (<>  {todo.date_todo.slice(5,10).split("-").reverse().join("/")}</>)}
          </div>
          ) }
            {/* {todo.todo_text} */}
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
   return (<div>
        {todosList}
   </div>)
}

export default Todos
