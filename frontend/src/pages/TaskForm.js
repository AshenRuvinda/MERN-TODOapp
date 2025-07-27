import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Calendar, 
  Flag, 
  Paperclip, 
  X, 
  Save,
  FileText,
  Target,
  Clock,
  CheckSquare,
  ArrowLeft
} from 'lucide-react';

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

  const removeSubtask = (index) => {
    const newSubtasks = formData.subtasks.filter((_, i) => i !== index);
    setFormData({ ...formData, subtasks: newSubtasks });
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'High': return 'border-red-300 bg-red-50';
      case 'Medium': return 'border-amber-300 bg-amber-50';
      case 'Low': return 'border-emerald-300 bg-emerald-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 ml-64">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Header */}
        <div className="mb-8 flex-1">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <Target className="h-8 w-8 text-gray-800" />
            <h1 className="text-3xl font-semibold text-gray-900">Create New Task</h1>
          </div>
          <p className="text-gray-600 ml-11">Add a new task to organize your workflow</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1">
          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-8">
              {/* Task Title */}
              <div>
                <label className="flex items-center space-x-2 text-gray-900 font-medium mb-3">
                  <FileText className="h-4 w-4" />
                  <span>Task Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter task title"
                  required
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="flex items-center space-x-2 text-gray-900 font-medium mb-3">
                  <FileText className="h-4 w-4" />
                  <span>Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Describe the task details"
                  rows="4"
                />
              </div>

              {/* Task Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Due Date */}
                <div>
                  <label className="flex items-center space-x-2 text-gray-900 font-medium mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>Due Date</span>
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="flex items-center space-x-2 text-gray-900 font-medium mb-3">
                    <Flag className="h-4 w-4" />
                    <span>Priority</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none ${getPriorityStyles(formData.priority)}`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center space-x-2 text-gray-900 font-medium mb-3">
                    <Clock className="h-4 w-4" />
                    <span>Status</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              {/* File Attachment */}
              <div>
                <label className="flex items-center space-x-2 text-gray-900 font-medium mb-3">
                  <Paperclip className="h-4 w-4" />
                  <span>Attachment</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    name="attachments"
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-3">
                      <Paperclip className="h-8 w-8 text-gray-400 mx-auto" />
                      <div>
                        <span className="text-blue-600 font-medium">Choose file</span>
                        <span className="text-gray-600"> or drag and drop</span>
                      </div>
                      <p className="text-sm text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </label>
                  {formData.attachments && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-700 font-medium">{formData.attachments.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Subtasks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center space-x-2 text-gray-900 font-medium">
                    <CheckSquare className="h-4 w-4" />
                    <span>Subtasks</span>
                  </label>
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Subtask</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                      <input
                        type="text"
                        value={subtask.title}
                        onChange={(e) => updateSubtask(index, e.target.value)}
                        placeholder={`Subtask ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubtask(index)}
                        className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {formData.subtasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="font-medium">No subtasks added</p>
                      <p className="text-sm">Break down your task into smaller steps</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-2 px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>

              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                <Save className="h-4 w-4" />
                <span>Create Task</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-6">
          {/* Quick Tips */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="flex items-center space-x-2 text-gray-900 font-medium mb-4">
              <FileText className="h-4 w-4" />
              <span>Quick Tips</span>
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Use clear, action-oriented titles for better task management</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Break complex tasks into smaller subtasks for easier tracking</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Set realistic due dates to maintain workflow efficiency</p>
              </div>
            </div>
          </div>

          {/* Priority Guide */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="flex items-center space-x-2 text-gray-900 font-medium mb-4">
              <Flag className="h-4 w-4" />
              <span>Priority Guide</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">High Priority</p>
                  <p className="text-xs text-gray-500">Urgent tasks requiring immediate attention</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Medium Priority</p>
                  <p className="text-xs text-gray-500">Important tasks with flexible deadlines</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Low Priority</p>
                  <p className="text-xs text-gray-500">Tasks that can be done when time permits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="flex items-center space-x-2 text-gray-900 font-medium mb-4">
              <Target className="h-4 w-4" />
              <span>Shortcuts</span>
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Save task</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-700">Ctrl + S</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Add subtask</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-700">Ctrl + ↵</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cancel</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-700">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;