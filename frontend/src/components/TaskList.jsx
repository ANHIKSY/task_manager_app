import api from '../api/axios';

export default function TaskList({ tasks, setTasks }) {
  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleToggle = async (task) => {
    const res = await api.put(`/tasks/${task.id}`, {
      completed: !task.completed,
    });
    setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
  };

  if (tasks.length === 0) {
    return <p className="muted">No tasks yet. Add one above!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <div className="task-content">
            <div className="task-title">{task.title}</div>
            {task.description && <div className="task-desc">{task.description}</div>}
          </div>
          <div className="task-actions">
            <button className="secondary small" onClick={() => handleToggle(task)}>
              {task.completed ? 'Undo' : 'Done'}
            </button>
            <button className="danger small" onClick={() => handleDelete(task.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}