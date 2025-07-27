import { useState } from 'react';
  import axios from 'axios';
  import { toast } from 'react-toastify';

  const SubtaskList = ({ subtasks, taskId }) => {
    const [subtaskList, setSubtaskList] = useState(subtasks);

    const toggleSubtask = async (index) => {
      const newSubtasks = [...subtaskList];
      newSubtasks[index].completed = !newSubtasks[index].completed;
      try {
        await axios.put(`/api/tasks/${taskId}`, { subtasks: newSubtasks }, { withCredentials: true });
        setSubtaskList(newSubtasks);
        toast.success('Subtask updated');
      } catch (error) {
        toast.error('Failed to update subtask');
      }
    };

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-secondary mb-2">Subtasks</h3>
        {subtaskList.map((subtask, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={() => toggleSubtask(index)}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className={`ml-2 ${subtask.completed ? 'line-through text-gray-500' : 'text-secondary'}`}>
              {subtask.title}
            </span>
          </div>
        ))}
      </div>
    );
  };

  export default SubtaskList;