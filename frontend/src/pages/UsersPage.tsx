import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Импортируем API для запросов

function UsersPage() {
  const [users, setUsers] = useState<{ id: number; email: string; password: string }[]>([]);
  const [newUser, setNewUser] = useState({ email: '', password: '' });

  // Получение пользователей при загрузке страницы
  useEffect(() => {
    api.get('api/users/').then((response) => setUsers(response.data));
  }, []);

  // Добавление нового пользователя
  const addUser = () => {
    api.post('api/users/', newUser).then((response) => {
      setUsers((prev) => [...prev, response.data]); // Обновляем список пользователей
      setNewUser({ email: '', password: '' }); // Очищаем форму
    });
  };

  return (
    <div>
      <h1>Users:</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.email}
          </li>
        ))}
      </ul>

      <h2>Add New User:</h2>
      <input
        type="email"
        placeholder="email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />
      <button onClick={addUser}>Add User</button>
    </div>
  );
}

export default UsersPage;
