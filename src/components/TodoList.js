import React, { useEffect, useRef, useState } from 'react';
import TodoForm from './TodoForm';
import axios from 'axios';
import {ADD_SOME, NEXT, NOTHING_PLANNED, PREV, SEARCH_TODO, SKIPS, TITLE, UPDATE_TODO} from '../utils/constants';
import Todos from './Todos';
function TodoList() {

 
  const [todos, setTodos] = useState([]);
  const [nr_skips,setnr_skips] = useState(0);
  const [todosNumber,setTodosNumber]=useState(0);
  const currentDate = new Date();
  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
  const currentYear = currentDate.getFullYear();
  let dateString = undefined;
  if(currentMonth < 10){
    dateString =+ currentYear + "-" + 0 +(currentMonth + 1) + "-" +  currentDayOfMonth ;
  }
  else{
    dateString=+ currentYear + "-" + (currentMonth + 1) + "-" +  currentDayOfMonth ;
  }
  const [dateOfTodo,setDateOfTodo]= useState(dateString)
  const [edit, setEdit] = useState({
    id: null,
    value: ''
  });
  const inputRef = useRef(null);
  const showAll = () =>{
    setDateOfTodo('All')
  };
  const showToday = () =>{
    setDateOfTodo(dateString);
    setnr_skips(0);
  };
  const onChangeSetDate = async todo =>{
    setnr_skips(0);
    setDateOfTodo(todo);
    await axios.get(`/dayfilter/${todo}/${SKIPS}`).then(res => setTodos(res.data));
  }
  const [input, setInput] = useState('');
    const [response,setResponse] = useState([]);
    const handleChange = async e => {
        setInput(e.target.value);
        if(e.target.value)
        {
     await axios.get(`/search/${e.target.value}`).then(res => setResponse(res.data))
        }
        else{
            setResponse([])
        }
    };
    useEffect(() => {
      inputRef?.current?.focus();
    },[input]);
  const submitUpdate = value => {
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: ''
    });
  };

 

  const addTodo = async todo => {
    if (!todo.todo_text || /^\s*$/.test(todo.todo_text)) {
      return;
    }
    await axios.post("/todos",{
      "todo_text":todo.todo_text,
      "date_todo":todo.date_todo,
      "completed_todo":todo.completed_todo
    });
    if(dateOfTodo!=="All"){ 
      await axios.get(`/dayfilter/${todo.date_todo}/${nr_skips}`).then(res => setTodos(res.data));
   // await axios.get(`/getTodos/page/${nr_skips}`).then(res => setTodos(res.data));
    await axios.get(`/dayfilter/${dateOfTodo}`).then(res => setTodosNumber(res.data));
  }
  else{
    await axios.get(`/getTodos/page/${nr_skips}`).then(res => setTodos(res.data));
    await axios.get(`/getTodos`).then(res => setTodosNumber(res.data));
  }
    
  };
  // useEffect(()=>{
  //   async function fetchData() {
  //     await axios.get(`/getTodos`).then(res => setTodosNumber(res.data))
  //   };
  //   fetchData();
  //    },[todos.length])
   
  // useEffect(()=>{
  //   async function fetchData() {
  //     await axios.get(`/getTodos/page/${nr_skips}`).then(res => setTodos(res.data));
  //   }
  //   fetchData();
  //   },[todos.length,nr_skips])

   useEffect(()=>{
    async function fetchData() {
      await axios.get(`/dayfilter/${dateOfTodo}`).then(res => setTodosNumber(res.data))
    };
    async function fetchDataAll() {
      await axios.get(`/getTodos`).then(res => setTodosNumber(res.data));
    }
    if(dateOfTodo!=="All"){
      fetchData();
      }
      else if(dateOfTodo==="All"){
        fetchDataAll();
      }
     },[dateOfTodo,todos.length])

   useEffect(()=>{
    async function fetchData() {
      await axios.get(`/dayfilter/${dateOfTodo}/${nr_skips}`).then(res => setTodos(res.data));
    }
    async function fetchDataAll() {
      await axios.get(`/getTodos/page/${nr_skips}`).then(res => setTodos(res.data));
    }
    if(dateOfTodo!=="All"){
    fetchData();
    }
    else if(dateOfTodo==="All"){
      fetchDataAll();
    }
    },[todos.length,dateOfTodo,nr_skips])
  
  const updateTodo = async (todoId, newValue) => {
    if (!newValue.todo_text || /^\s*$/.test(newValue.todo_text)) {
      return;
    }
   await axios.post('/update',{"id":todoId,"todo_text":newValue.todo_text,"date_todo":newValue.date_todo})
   if(dateOfTodo!=="All"){
    await axios.get(`/dayfilter/${dateOfTodo}/${nr_skips}`).then(res => setTodos(res.data));
    }
    else if(dateOfTodo==="All"){
      await axios.get(`/getTodos/page/${nr_skips}`).then(res => setTodos(res.data));
    }
   
   if(input){
   await axios.get(`/search/${input}`).then(res => setResponse(res.data))
   }
  };

    const removeTodo = async id => {
    const removedArr = [...todos].filter(todo => todo._id !== id);
    await axios.post('/delete',{"id":id});
    if(input){
    await axios.get(`/search/${input}`).then(res => setResponse(res.data))}
   //axios.get('/getTodos').then(res => setTodosNumber(res.data))
    // console.log('todosNumber.length')
    // console.log(todosNumber.length)
    // console.log('nr_skips')
    // console.log(nr_skips)

    if(todosNumber.length>=SKIPS && todosNumber.length-1===nr_skips){
      setnr_skips(nr_skips-SKIPS);
    }
    setTodos(removedArr);
    //axios.get('/getTodos').then(res => setTodosNumber(res.data))
  };
  
  const completeTodo = async (id,completed) => {
    let updatedTodos = todos.map(todo => {
      if (todo._id === id) {
        todo.completed_todo = !todo.completed_todo;
      completed=todo.completed_todo;
      }
      return todo;
    });
    await axios.post('/completed',{"id":id,"completed_todo":completed});
    setTodos(updatedTodos);
  };

  const completeTodoSearch = async (id,completed) => {
    let updatedTodos = response.map(todo => {
      if (todo._id === id) {
        todo.completed_todo = !todo.completed_todo;
      completed=todo.completed_todo;
      }
      return todo;
    });
    await axios.post('/completed',{"id":id,"completed_todo":completed});
    setTodos(updatedTodos);
    setResponse(updatedTodos);
  };

  const newPage = (direction) => {
    if (direction === "next") {
      setnr_skips(nr_skips + SKIPS);
    } else if (direction === "previous") {
      setnr_skips(nr_skips - SKIPS);
    }
  };
  //console.log(nr_skips);

  if(edit.id) {
    return (
    <div style={{minHeight:'51.9em'}}>
    <h1>{UPDATE_TODO}</h1>
    <TodoForm onChangeSetDate={onChangeSetDate} dateOfTodo={dateOfTodo} edit={edit} onSubmit={submitUpdate} />
    </div>
    );
  }
  if(input) {
    return (
    <div style={{minHeight:'51.9em'}}>
    <h1>{SEARCH_TODO}</h1>
    <form className='todo-form'>
          <input
          autoComplete="off"
            placeholder={SEARCH_TODO}
            value={input}
            onChange={handleChange}
            name='text'
            ref={inputRef}
            className='todo-input-search-page'
          />
    </form>
    <Todos todos={response}  removeTodo={removeTodo} setEdit={setEdit} completeTodo={completeTodoSearch} dateOfTodo={dateOfTodo}/>
    {/* {searchtodosList.length > 0 ? (<>{searchtodosList}</>) : (
      <div style={{paddingTop:'20em'}}>
    <p>{TODO_NOT_FOUND}</p>
    </div>
    )} */}
    </div>
    
    );
  }

  
  return (
    <>
      <h1>{TITLE}</h1>
    <TodoForm dateOfTodo={dateOfTodo} onChangeSetDate={onChangeSetDate} onSubmit={addTodo} />
      
    <div className="search_reset_container">
      <div>
          <input
          autoComplete="off"
          placeholder={SEARCH_TODO}
          value={input}
          onChange={handleChange}
          name='text'
          ref={inputRef}
          className='todo-input-search'
          />
          </div>
          <div>
          {dateOfTodo!=="All" ? (
             <button onClick={showAll}  className='todo-button'>
             Show All
           </button>
          ) : ( <button onClick={showToday}  className='todo-button'>
          Today
        </button>) }
          
          </div>
     </div>
    
    
      <div style={{minHeight:'33em'}}> 
      {todos.length === 0 ? ( 
      <div style={{paddingTop:'10em'}}>
        <h1>{NOTHING_PLANNED}</h1>
        <p>{ADD_SOME}</p>
    </div>) : (
       
        <Todos todos={todos}  removeTodo={removeTodo} setEdit={setEdit} completeTodo={completeTodo} dateOfTodo={dateOfTodo}/>
      
      ) }
    
      </div>
      <div className="navigation_buttons">
      {nr_skips >= SKIPS ? ( <button
      className='todo-button'
            onClick={()=>newPage("previous")}
            //className="button__page"
            style={{
                minWidth: '7vw',
                marginTop:'15px',
                marginLeft:'26px',
                marginBottom:'15px',
                }}
            >Prev 
            </button>) : (<button
      className='todo-button'
            onClick={()=>newPage("previous")}
            //className="button__page"
            style={{
                minWidth: '7vw',
                marginTop:'15px',
                marginLeft:'26px',
                marginBottom:'15px',
                opacity: '0'
                }}
            >{PREV} 
            </button>) }
     
            {nr_skips <todosNumber.length-SKIPS ? (<button
            style={{
                //backgroundColor:'white',
                marginTop:'15px',
                marginRight:'26px',
                marginBottom:'15px',
                color:'white',
                minWidth:'7vw',
                     }}
            onClick={()=>newPage("next")}
            className='todo-button'
            >{NEXT} 
            </button>) : (null) }
            
      </div>
     

    </>
  );
}

export default TodoList;
