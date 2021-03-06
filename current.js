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


const getVisibleTodos = (todos, currentFilter) => {
  if(currentFilter == "SHOW_ACTIVE"){
    return todos.filter(t => !t.completed);
  }else if(currentFilter == "SHOW_COMPLETED"){
    return todos.filter(t => t.completed);
  }else{
    return todos;
  }
}



/*---------------------------------------------------
							ACTION CREATORS
--------------------------------------------------- */
var initialId = 1;
const addTodo = (text) => {
	return {type:"ADD_TODO", id:initialId++, text};
}

const toggleTodo = (id) => {
	return {type: "TOGGLE_TODO", id}
}

const filterTodos = (filter) => {
	return {type:"SET_VISIBILITY_FILTER", filter}
}


/*---------------------------------------------------
							COMPONENTS
--------------------------------------------------- */

const {Component} = React;
const {combineReducers, createStore} = Redux;
const {Provider, connect} = ReactRedux;

const Link = ({active, children, onClick}) => {
  if(!active){
    return (
	    <a href="#"
	      onClick = {(e) => {
	      	e.preventDefault();
	        onClick()
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

const mapStateToLinkProps = (state, ownProps) => {
	return {active: ownProps.filter === state.visibilityFilter};
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
	return {
		onClick: () => {
			dispatch(filterTodos(ownProps.filter));
		}	
	};
};

const FilterLink = connect(
	mapStateToLinkProps,
	mapDispatchToLinkProps
)(Link)

const mapStateToVisibleTodoListProps = (state) => {
	return {
		todos: getVisibleTodos(state.todos, state.visibilityFilter)
	};
};

const mapDispatchToVisibleTodoListProps = (dispatch) => {
	return {
		onTodoClick : (id) => {
			dispatch(toggleTodo(id))
		}
	};
};

const VisibleTodoList = connect(
	mapStateToVisibleTodoListProps,
	mapDispatchToVisibleTodoListProps
)(TodoList);


let AddTodo = ({dispatch}) => {
	let input;

	function handleAddClick(){
    dispatch(addTodo(input.value));
    input.value = "";
  }

	return (
		<div>
	    <input ref={(ref) => input = ref} type="text" />
	    <button
	    	onClick={handleAddClick}>
	      Add
	    </button>
		</div>
	)
}

AddTodo = connect()(AddTodo)


const Footer = () => {
	return (
  	<p>
	    Show 
	    {' '}
	    <FilterLink filter="SHOW_ALL">All</FilterLink>
	    {' '}
	    <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
	   	{' '}
	    <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
	  </p>
	)
}



const todoApp = combineReducers({
  todos:todos,
  visibilityFilter:visibilityFilter
})

const TodoApp = () => {
	return(
    <div>
      <AddTodo/>
    	<VisibleTodoList/>
			<Footer/>
    </div>
  )
}


ReactDOM.render(
	<Provider store={createStore(todoApp)}>
		<TodoApp />
	</Provider>,
	 document.querySelector('#root')
);






