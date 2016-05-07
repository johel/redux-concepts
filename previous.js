const addCounter = (list) => {
//   list.push(0);
  return [...list, 0];
}

const removeCounter = (list, index) => {
  return [
    ...list.slice(0,index), ...list.slice(index+1)
  ];
}

const incrementCounter = (list, index) => {
  return [
    ...list.slice(0,index),list[index] + 1, ...list.slice(index+1)
  ];
}

const testAddCounter = () => {
  listBefore = [];
  listAfter = [0];
  deepFreeze(listBefore)
  expect(addCounter(listBefore)).toEqual(listAfter);
}

const testRemoveCounter = () => {
  listBefore = [1,2,3];
  listAfter = [1,3];
  deepFreeze(listBefore)
  expect(removeCounter(listBefore, 1)).toEqual(listAfter);
}

const testIncrementCounter = () => {
  listBefore = [1,2,3];
  listAfter = [1,2,4];
  deepFreeze(listBefore);
  expect(incrementCounter(listBefore,2)).toEqual(listAfter);
}

testAddCounter();
testRemoveCounter();
testIncrementCounter();

console.log("deu certo")