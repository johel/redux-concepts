var initialId = 1;
const todos = (state=[], action) => {
  if(action.type == "ADD_TODO"){
    return [...state, {
      id: initialId++,
      text:action.text,
      completed:false
    }];
  }else if(action.type="TOGGLE_TODO"){
    return state.map(t => {
      if(t.id !== action.id){
        return t;
      }else{
        return Object.assign({}, t, {completed:!t.completed});
      }
    })   
  }else{
    return state;
  }
};

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