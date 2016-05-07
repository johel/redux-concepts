//var initialId = 1;

/*---------------------------------------------------
							REDUCERS
--------------------------------------------------- */


const todo = (state, action)=> {
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

// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//   }
// }

//is identical to the code below

const {combineReducers} = Redux;
//keys are state properties to be created in the store
//props are the reducers
//see: http://redux.js.org/docs/api/combineReducers.html
const todoApp = combineReducers({
  todos:todos,
  visibilityFilter:visibilityFilter
})

/*---------------------------------------------------
							TESTS
--------------------------------------------------- */

const testAddTodo = (todo) => {
  const beforeState = [];
  const action = {
    id:1,
    text:'text',
    type:'ADD_TODO'
  }
  const afterState = [{
    id:1,
    text:'text',
    completed:false
  }]
  deepFreeze(beforeState);
  deepFreeze(action);
  expect(todos(beforeState, action)).toEqual(afterState);
  
}

const testToggleTodo = () => {
  const beforeState= [
    {id:1, text:'text1', completed:false},
    {id:2, text:'text2', completed:false}
  ]
 
  const action = {
    type:"TOGGLE_TODO",
    id:2
  };
  const afterState = [
    {id:1, text:'text1', completed:false},
    {id:2, text:'text2', completed:true}
  ];
  
  deepFreeze(beforeState);
  deepFreeze(action);
  expect(todos(beforeState, action)).toEqual(afterState);
}

const testVisibilityFilter = () => {
  const stateBefore = "SHOW_ACTIVE"
  const action = {type:"SET_VISIBILITY_FILTER", filter:"SHOW_ALL"};
  const stateAfter = 'SHOW_ALL';
  deepFreeze(stateBefore);
  deepFreeze(action);
  expect(visibilityFilter(stateBefore, action)).toEqual(stateAfter);
      
}


// testAddTodo();
// testToggleTodo();
// testVisibilityFilter();

/*---------------------------------------------------
							LOGS
--------------------------------------------------- */

const {createStore} = Redux;

const store = createStore(todoApp);

console.log('initial state');
console.log(store.getState());
console.log('..............');


console.log('add todo');
store.dispatch({id:1,text:'first thing', type:"ADD_TODO"});
console.log(store.getState());
console.log('..............');


console.log('add second todo');
store.dispatch({id:2,text:'second thing', type:"ADD_TODO"});
console.log(store.getState());
console.log('..............');

console.log('toggle second todo');
store.dispatch({id:2, type:"TOGGLE_TODO"});
console.log(store.getState());
console.log('..............');

console.log('change visibility filter');
store.dispatch({filter:"SHOW_ACTIVE", type:"SET_VISIBILITY_FILTER"});
console.log(store.getState());
console.log('..............');
