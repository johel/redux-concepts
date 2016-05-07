const toggleTodo = (todo) => {
    //ES6
	//return Object.assign({}, todo, {completed:!todo.completed});
  
    //ES7 Object Spread
    return {...todo, completed: !todo.completed};
}

const testToggleTodo = () => {
	const todoBefore = {
		id:1,
		text:'text',
		completed:true
	};
	const todoAfter = {
		id:1,
		text:'text',
		completed:false
	};
  
    deepFreeze(todoBefore)
    
	expect(toggleTodo(todoBefore)).toEqual(todoAfter);
}

testToggleTodo();
console.log('deu certo');