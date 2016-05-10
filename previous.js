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

class FilterLink extends Component {

	componentDidMount(){
		const {store} = this.context;
		let that = this;
		this.unsubscribe = store.subscribe(() => that.forceUpdate());
	}

	componentWillUnmount(){
		this.unsubscribe();
	}

	render(){
		const props = this.props;
		const {store} = this.context;
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
FilterLink.contextTypes = {
	store: React.PropTypes.object
};

const mapStateToVisibleTodoListProps = (state) => {
	return {
		todos: getVisibleTodos(state.todos, state.visibilityFilter)
	};
};

const mapDispatchToVisibleTodoListProps = (dispatch) => {
	return {
		onTodoClick : (id) => {
			dispatch({
				type:"TOGGLE_TODO",
  			id
  		})
		}
	};
};

const VisibleTodoList = connect(
	mapStateToVisibleTodoListProps,
	mapDispatchToVisibleTodoListProps
)(TodoList);


var initialId = 1;
let AddTodo = ({dispatch}) => {
	let input;

	function handleAddClick(){
		console.log('hadle click input', input);
    const action = {type:"ADD_TODO", id:initialId++, text:input.value};
    dispatch(action);
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

// AddTodo = connect(
// 	state => {
// 		return {};
// 	},
// 	dispatch => {
// 		return {dispatch} // which is the same of: return {dispatch:dispatch}
// 	}
// )

//which is equal to the code below

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






