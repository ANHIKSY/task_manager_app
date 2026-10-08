import { useState } from 'react';
import api from '../api/axios';

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks/', { title, description });
      onTaskCreated(res.data);
      setTitle('');
      setDescription('');
    } catch {
      alert('Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        placeholder="What needs to be done?" value={title}
        onChange={(e) => setTitle(e.target.value)} required
      />
      <input
        placeholder="Description (optional)" value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}