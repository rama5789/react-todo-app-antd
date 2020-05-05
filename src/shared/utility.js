const attachKeyToArrayElements = (arrayObj = [], keyName = '') => {
  const modifiedArrayObj = [];

  if (arrayObj.length && keyName && typeof keyName === 'string') {
    return arrayObj.map((el) => {
      el.key = el[keyName];
      return el;
    });
  } else {
    return modifiedArrayObj;
  }
};

/* Test "attachKeyToArrayElements" function */
/* const oldArray = [{
    id: 0,
    id2: 100,
    action: 'Laundry',
    dateAdded: '2020-05-13 16:00:00'
}, {
    id: 1,
    id2: 101,
    action: 'Check Email',
    dateAdded: '2020-05-23 16:00:00'
}];

const newArray = attachKeyToArrayElements(oldArray, 'id');
// const newArray = attachKeyToArrayElements(oldArray, 'id2');

console.log('newArray ', newArray); */
