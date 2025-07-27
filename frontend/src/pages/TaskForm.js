import { useState, useContext } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import { AuthContext } from '../context/AuthContext';
  import { toast } from 'react-toastify';

  const TaskForm = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      status: 'Todo',
      attachments: null,
      subtasks: [],
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('dueDate', formData.dueDate);
      data.append('priority', formData.priority);
      data.append('status', formData.status);
      if (formData.attachments) {
        data.append('attachments', formData.attachments);
      }
      data.append('subtasks', JSON.stringify(formData.subtasks));

      try {
        await axios.post('/api/tasks', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        toast.success('Task created successfully!');
        navigate('/dashboard');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create task');
      }
    };

    const handleChange = (e) => {
      const { name, value, files } = e.target;
      setFormData({
        ...formData,
        [name]: files ? files[0] : value,
      });
    };

    const addSubtask = () => {
      setFormData({
        ...formData,
        subtasks: [...formData.subtasks, { title: '', completed: false }],
      });
    };

    const updateSubtask = (index, title) => {
      const newSubtasks = [...formData.subtasks];
      newSubtasks[index].title = title;
      setFormData({ ...formData, subtasks: newSubtasks });
    };

    if (!user) return null;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="card">
          <h2 className="text-3xl font-bold mb-6 text-primary">Create Task</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-secondary mb-2" htmlFor="title">Task Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-secondary mb-2" htmlFor="description">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input"
                placeholder="Enter task description"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-secondary mb-2" htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="mb-4">
              <label className="block text-secondary mb-2" htmlFor="priority">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-secondary mb-2" htmlFor="status">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-secondary mb-2" htmlFor="attachments">Attachment</label>
              <input
                type="file"
                name="attachments"
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-secondary mb-2">Subtasks</h3>
              {formData.subtasks.map((subtask, index) => (
                <input
                  key={index}
                  type="text"
                  value={subtask.title}
                  onChange={(e) => updateSubtask(index, e.target.value)}
                  placeholder={`Subtask ${index + 1}`}
                  className="input mb-2"
                />
              ))}
              <button
                type="button"
                onClick={addSubtask}
                className="text-primary hover:underline"
              >
                Add Subtask
              </button>
            </div>
            <button type="submit" className="btn-primary w-full">Create Task</button>
          </form>
        </div>
      </div>
    );
  };

  export default TaskForm;