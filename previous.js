//var initialId = 1;

/*---------------------------------------------------
							REDUCERS
--------------------------------------------------- */


const todo = (state, action) => {
  if(action.type == "ADD_TODO"){
    return {
      id: action.id,
      text:action.text,
      completed:false
    }
  }else if(action.type=="TOGGLE_TODO"){
    if(action.id !== state.id){
      return state;
    }
    return {...state, completed:!state.completed};
  }else{
    return state;
  }
}

const todos = (state=[], action) => {
  if(action.type == "ADD_TODO"){
    return [...state, todo(undefined,action)];
  }else if(action.type=="TOGGLE_TODO"){
    return state.map(t => todo(t,action));   
  }else{
    return state;
  }
};

const visibilityFilter = (state = "SHOW_ALL", action) => {
  if(action.type == "SET_VISIBILITY_FILTER"){
    return action.filter;
  }else{
    return state;
  }
}

const {combineReducers, createStore} = Redux;
const {Component} = React;

const todoApp = combineReducers({
  todos:todos,
  visibilityFilter:visibilityFilter
})

const store = createStore(todoApp);


/*---------------------------------------------------
							COMPONENTS
--------------------------------------------------- */

const FilterLink = ({filter,currentFilter, children, onClick}) => {
  if(filter !== currentFilter){
    return (
	    <a href="#"
	      onClick = {(e) => {
	      	e.preventDefault();
	        onClick(filter)
	      }}>
	    		{children}
	    </a>
	  )
  }else{
    return <span>{children}</span>
  }
}

const Todo = ({
  onClick,
  completed,
  text
}) => {
  return <li 
    onClick = {onClick}
    style={{textDecoration: completed? 'line-through' : 'none'}}>
      {text}
  </li>
}

const TodoList = ({
	todos,
	onTodoClick
}) => {
	return <ul>
      {todos.map( (todo) => 
			<Todo 
				key = {todo.id}
				{...todo}
				onClick={()=> onTodoClick(todo.id)}
			/>
		)}
	</ul>
}

const AddTodo = ({
	onAddTodoClick
}) => {
	let input;
	return (
		<div>
	    <input ref={(ref) => input = ref} type="text" />
	    <button
	    	onClick={() => {
	    		onAddTodoClick(input);
		  }}>
	      Add
	    </button>
		</div>
	)
}

const Footer = ({
	visibilityFilter,
	onFilterClick
}) => {
	return (
  	<p>
	    Show 
	    {' '}
	    <FilterLink filter="SHOW_ALL" onClick={onFilterClick}
	      currentFilter={visibilityFilter}>All</FilterLink>
	    {' '}
	    <FilterLink filter="SHOW_ACTIVE" onClick={onFilterClick}
	      currentFilter={visibilityFilter}>Active</FilterLink>
	   	{' '}
	    <FilterLink filter="SHOW_COMPLETED" onClick={onFilterClick}
	      currentFilter={visibilityFilter}>Completed</FilterLink>
	  </p>
	)
}



const getVisibleTodos = (todos, currentFilter) => {
  if(currentFilter == "SHOW_ACTIVE"){
    return todos.filter(t => !t.completed);
  }else if(currentFilter == "SHOW_COMPLETED"){
    return todos.filter(t => t.completed);
  }else{
    return todos;
  }
}


var initialId = 1;

//ES6 needs to call bind on click event
class TodoApp extends Component{
  render(){
    const {todos, visibilityFilter} = this.props;
    const visibleTodos = getVisibleTodos(todos, visibilityFilter);
    return(
       <div>
        <AddTodo onAddTodoClick = {this.handleAddClick} />
      	<TodoList
      	  todos={visibleTodos}
      	  onTodoClick = { id => 
      	  	store.dispatch({
      	  		type:"TOGGLE_TODO",
      	  		id:id
      	  	})
      	  }
      	/>
  			<Footer
  				visibilityFilter={visibilityFilter}
  				onFilterClick = {(filter) => {
  					store.dispatch({type:"SET_VISIBILITY_FILTER", filter:filter});
  				}}
  			/>
      </div>
    )
  }

  
  handleAddClick(input){
    const action = {type:"ADD_TODO", id:initialId++, text:input.value};
    store.dispatch(action);
    input.value = "";
  }

}

const render = () => {
  //console.log('store state', store.getState());
  ReactDOM.render(
    <TodoApp {...store.getState()} 
    />, document.querySelector('#root'));
}

store.subscribe(render);
render();




