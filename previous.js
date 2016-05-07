var initialId = 1;

/*---------------------------------------------------
							REDUCERS
--------------------------------------------------- */

/* individual todo reducer */
const todo = (state, action)=> {
  if(action.type == "ADD_TODO"){
    return {
      id: initialId++,
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

/* todos reducer */
const todos = (state=[], action) => {
  if(action.type == "ADD_TODO"){
    return [...state, todo(undefined,action)];
  }else if(action.type="TOGGLE_TODO"){
    return state.map(t => todo(t,action));   
  }else{
    return state;
  }
};


/*---------------------------------------------------
							TESTS
--------------------------------------------------- */

const testAddTodo = (todo) => {
  const beforeState = [];
  const action = {
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


testAddTodo();
testToggleTodo()

console.log('tests ok');