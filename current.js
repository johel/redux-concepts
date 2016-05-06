function counter(state = 0, action){

  if(action.type === "INCREMENT"){
    return state + 1;
  }else if(action.type === "DECREMENT"){
    return state -1;
  }else{
    return state;
  }
 
}

const {createStore} = Redux;

const store = createStore(counter);

const render = () => {
  document.body.innerText = store.getState();
};

store.subscribe(render);
render();


document.addEventListener('click', function(){
  store.dispatch({type:"INCREMENT"});
});



