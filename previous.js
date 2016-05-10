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
							COMPONENTS
--------------------------------------------------- */

const {Component} = React;

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

class FilterLink extends Component {

	componentDidMount(){
		const {store} = this.props;
		let that = this;
		this.unsubscribe = store.subscribe(() => that.forceUpdate());
	}

	componentWillUnmount(){
		this.unsubscribe();
	}

	render(){
		const props = this.props;
		const {store} = props;
		const state = store.getState();
		return (
			<Link 
				active = {props.filter === state.visibilityFilter}
				onClick = { () => {
					store.dispatch({type:"SET_VISIBILITY_FILTER", filter:props.filter});
				}}
			>
				{props.children}
			</Link>
		)
	}

}

class VisibleTodoList extends Component{
	componentDidMount(){
		const {store} = this.props;
		let that = this;
		this.unsubscribe = store.subscribe(() => that.forceUpdate());
	}

	componentWillUnmount(){
		this.unsubscribe();
	}

	todoToggleClick(id){
		const {store} = this.props;
		store.dispatch({
  		type:"TOGGLE_TODO",
  		id
  	});
	}

	render(){
		const {store} = this.props;
		const state = store.getState();
		const visibleTodos = getVisibleTodos(state.todos, state.visibilityFilter)
  	return <TodoList
  	  todos={visibleTodos}
  	  onTodoClick = {this.todoToggleClick.bind(this)}
  	/>

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

var initialId = 1;
const AddTodo = ({store}) => {
	let input;

	function handleAddClick(){
		console.log('hadle click input', input);
    const action = {type:"ADD_TODO", id:initialId++, text:input.value};
    store.dispatch(action);
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

const Footer = ({store}) => {
	return (
  	<p>
	    Show 
	    {' '}
	    <FilterLink store={store} filter="SHOW_ALL">All</FilterLink>
	    {' '}
	    <FilterLink store={store} filter="SHOW_ACTIVE">Active</FilterLink>
	   	{' '}
	    <FilterLink store={store} filter="SHOW_COMPLETED">Completed</FilterLink>
	  </p>
	)
}


const {combineReducers, createStore} = Redux;

const todoApp = combineReducers({
  todos:todos,
  visibilityFilter:visibilityFilter
})

const TodoApp = ({store}) => {
	return(
    <div>
      <AddTodo store={store} />
    	<VisibleTodoList store={store}/>
			<Footer store={store}/>
    </div>
  )
}


ReactDOM.render(<TodoApp store={createStore(todoApp)}/>, document.querySelector('#root'));






