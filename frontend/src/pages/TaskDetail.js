import { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import { toast } from 'react-toastify';
  import SubtaskList from '../components/SubtaskList';

  const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);

    useEffect(() => {
      const fetchTask = async () => {
        try {
          const response = await axios.get(`/api/tasks/${id}`, { withCredentials: true });
          setTask(response.data);
        } catch (error) {
          toast.error('Failed to fetch task');
          navigate('/dashboard');
        }
      };
      fetchTask();
    }, [id, navigate]);

    if (!task) return <div className="text-center p-6">Loading...</div>;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="card">
          <h2 className="text-3xl font-bold mb-4 text-primary">{task.title}</h2>
          <p className="text-secondary mb-2">{task.description}</p>
          <p className="text-secondary mb-2">Status: <span className="font-semibold">{task.status}</span></p>
          <p className="text-secondary mb-2">Priority: <span className="font-semibold">{task.priority}</span></p>
          {task.dueDate && (
            <p className="text-secondary mb-2">Due: <span className="font-semibold">{new Date(task.dueDate).toLocaleDateString()}</span></p>
          )}
          {task.attachments && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-secondary mb-2">Attachment</h3>
              <a
                href={task.attachments}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Attachment
              </a>
            </div>
          )}
          <SubtaskList subtasks={task.subtasks || []} taskId={task._id} />
        </div>
      </div>
    );
  };

  export default TaskDetail;