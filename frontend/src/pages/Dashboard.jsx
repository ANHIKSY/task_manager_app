import { useEffect, useState } from 'react';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks/')
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleTaskCreated = (newTask) => setTasks([...tasks, newTask]);

  return (
    <div className="container">
      <div className="card">
        <h2>My Tasks</h2>
        <TaskForm onTaskCreated={handleTaskCreated} />
        {loading ? <p className="muted">Loading...</p> : (
          <TaskList tasks={tasks} setTasks={setTasks} />
        )}
      </div>
    </div>
  );
}