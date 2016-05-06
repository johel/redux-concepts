function counter(state = 0, action){

  if(action.type === "INCREMENT"){
    return state + 1;
  }else if(action.type === "DECREMENT"){
    return state -1;
  }else{
    return state;
  }
 
}

function createStore(reducer){
  var listeners = [];
  var state;
  var store = {
    getState:function(){
      return state;
    },
    dispatch:function(action){
      console.log('dispatch');
      state = reducer(state, action);
      console.log('state', state);
      listeners.forEach((listener)=> listener());
    },
    subscribe:function(listener){
      console.log('subscribe');
      listeners.push(listener);
      function unsubscribe(){
        listeners = listeners.filter(item => item !== listener);
      }
      return unsubscribe;
    }   
  };
  
  store.dispatch({});
  
  return store;
   
}

// const {createStore} = Redux;

const store = createStore(counter);

const render = () => {
  document.body.innerText = store.getState();
};

store.subscribe(render);
render();


document.addEventListener('click', function(){
  store.dispatch({type:"INCREMENT"});
});



