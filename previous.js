var initialId = 1;
const todos = (state=[], action) => {
  if(action.type == "ADD_TODO"){
    return [...state, {
      id: initialId++,
      text:action.text,
      completed:false
    }];
  }else{
    return state;
  }
}

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


testAddTodo();
console.log('tests ok');