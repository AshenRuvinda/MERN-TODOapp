import { useDrag } from 'react-dnd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MoreHorizontal, Flag, CheckCircle2, Play, Trash2, Clock, Calendar } from 'lucide-react';

const TaskCard = ({ task, onUpdate, onRemove }) => {
  // Add props validation at the top
  useEffect(() => {
    console.log('TaskCard props:', { 
      taskId: task?._id, 
      hasOnUpdate: typeof onUpdate === 'function',
      hasOnRemove: typeof onRemove === 'function'
    });
  }, [task?._id, onUpdate, onRemove]);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleStatusChange = async (newStatus) => {
    try {
      // Update UI immediately for better UX
      onUpdate(task._id, newStatus);
      
      // Your original axios call would go here
      await axios.put(`/api/tasks/${task._id}`, { status: newStatus }, { withCredentials: true });
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      // Revert the UI change if API call fails
      onUpdate(task._id, task.status);
      toast.error('Failed to update task status');
    }
  };

  const handleRemoveTask = async () => {
    console.log('handleRemoveTask called');
    console.log('onRemove type:', typeof onRemove);
    console.log('onRemove function:', onRemove);
    
    if (!onRemove) {
      console.error('onRemove prop is missing!');
      toast.error('Cannot remove task: onRemove function not provided');
      return;
    }

    if (typeof onRemove !== 'function') {
      console.error('onRemove is not a function:', typeof onRemove);
      toast.error('Cannot remove task: invalid onRemove prop');
      return;
    }

    if (window.confirm('Are you sure you want to remove this task?')) {
      console.log('Attempting to remove task:', task._id);
      
      try {
        // Call API first, then update UI - your original axios call
        const response = await axios.delete(`/api/tasks/${task._id}`, { withCredentials: true });
        console.log('Delete response:', response);
        
        // Remove from UI after successful API call
        onRemove(task._id);
        toast.success('Task removed successfully');
        
      } catch (error) {
        console.error('Remove task error:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        if (error.response?.status === 404) {
          toast.error('Task not found');
        } else if (error.response?.status === 401) {
          toast.error('Unauthorized - please login again');
        } else {
          toast.error('Failed to remove task');
        }
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Todo': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'In Progress': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'Done': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-move ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 pr-2">
          {task.title}
        </h4>
        <div className="flex items-center space-x-1 flex-shrink-0">
          {/* Action Buttons */}
          {task.status !== 'In Progress' && task.status !== 'Done' && (
            <button
              onClick={() => handleStatusChange('In Progress')}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Start Task"
            >
              <Play className="h-3.5 w-3.5" />
            </button>
          )}
          
          {task.status !== 'Done' && (
            <button
              onClick={() => handleStatusChange('Done')}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              title="Complete Task"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
          )}
          
          <button
            onClick={handleRemoveTask}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {/* Status Badge */}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
            {task.status === 'Todo' && <Clock className="h-3 w-3 mr-1" />}
            {task.status === 'In Progress' && <Play className="h-3 w-3 mr-1" />}
            {task.status === 'Done' && <CheckCircle2 className="h-3 w-3 mr-1" />}
            {task.status}
          </span>

          {/* Due Date */}
          {task.dueDate && (
            <span className="inline-flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {/* Priority */}
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          <Flag className="h-3 w-3 mr-1" />
          {task.priority}
        </span>
      </div>

      {/* Subtasks Preview */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Subtasks
            </span>
            <span>
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
            </span>
          </div>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${task.subtasks.length > 0 ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100 : 0}%`
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;