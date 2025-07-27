import { useDrag } from 'react-dnd';

  const TaskCard = ({ task }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'TASK',
      item: { id: task._id, status: task.status },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className={`card mb-2 transition-opacity ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      >
        <h4 className="text-lg font-semibold text-primary">{task.title}</h4>
        <p className="text-secondary">{task.description}</p>
        <p className="text-sm text-secondary">Status: {task.status}</p>
        <p className="text-sm text-secondary">Priority: {task.priority}</p>
        {task.dueDate && (
          <p className="text-sm text-secondary">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
        )}
      </div>
    );
  };

  export default TaskCard;