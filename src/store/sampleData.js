/* Todo Sample Data */
export const todosSampleData = [
  {
    key: 0,
    id: 0,
    action: 'Laundry',
    dateAdded: '2025-05-10 11:00:00'
  },
  {
    key: 1,
    id: 1,
    action: 'Check Email',
    dateAdded: '2025-05-20 22:00:00'
  }
];

export const todosLoadData = () => {
  const todos = [];
  for (let i = 0; i < 100; i++) {
    todos.push({
      key: i,
      id: i,
      action: `Todo ${i}`,
      dateAdded: '2025-05-10 11:00:00'
    });
  }
  return todos;
};

/* User Sample Data */
export const usersSampleData = [
  {
    key: 0,
    id: 0,
    name: 'Rama Nayak',
    email: 'ramanayak@abc.com'
  },
  {
    key: 1,
    id: 1,
    name: 'Satish Panda',
    email: 'satishpanda@xyz.com'
  }
];

export const usersLoadData = () => {
  const users = [];
  for (let i = 0; i < 100; i++) {
    users.push({
      key: i,
      id: i,
      name: `Name ${i}`,
      email: `name_${i}@email.com`
    });
  }
  return users;
};
