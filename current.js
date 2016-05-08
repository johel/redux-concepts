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
  console.log(action.type);
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




var initialId = 1;

//ES6 needs to call bind on click event
class TodoApp extends Component{
  render(){
    return(
       <div>
        <input ref={(ref) => this.myTextInput = ref} type="text" />
        <button onClick={this.handleClick.bind(this)}>
          Add
        </button>
        <ul>
          {this.props.todos.map((todo)=>{
            return <li
             onClick={this.toggleTodo.bind(null,todo)}
             style={{textDecoration: todo.completed? 'line-through' : 'none'}}
             key={todo.id}>{todo.text}</li>
          })}
        </ul>
      </div>
    )
  }
  
  toggleTodo(todo){
    store.dispatch({type:"TOGGLE_TODO", id:todo.id})
  }

  
  handleClick(){
    const action = {type:"ADD_TODO", id:initialId++, text:this.myTextInput.value};
    store.dispatch(action);
    this.myTextInput.value = "";
  }

}

const render = () => {
  console.log('store state', store.getState());
  ReactDOM.render(<TodoApp todos={store.getState().todos}/>, document.querySelector('#root'));
}

store.subscribe(render);
render();





