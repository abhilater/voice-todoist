'use client';
import { useState, useEffect } from 'react';
import TaskList from '@/components/TaskList';
import VoiceButton from '@/components/VoiceButton';
import { Task } from '@/types';
import { parseTaskWithDate } from '@/utils/dateParser';

interface StoredTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('voice-todoist-tasks');
    if (savedTasks) {
      try {
        const parsed: StoredTask[] = JSON.parse(savedTasks);
        setTasks(parsed.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        })));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('voice-todoist-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }, [tasks]);

  const addTask = (text: string) => {
    if (!text.trim()) return;

    const { taskText, dueDate } = parseTaskWithDate(text);
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      createdAt: new Date(),
      dueDate
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
    
    if (dueDate) {
      showAlert('success', `Task added with due date: ${dueDate.toLocaleDateString()}`);
    }
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleVoiceResult = (text: string) => {
    addTask(text);
    showAlert('info', `Voice input: "${text}"`);
  };

  const showAlert = (type: string, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTask(newTaskText);
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col">
          <h1 className="text-center mb-4">Voice Todoist Clone</h1>
          
          {alert && (
            <div className={`alert alert-${alert.type} alert-dismissible`}>
              {alert.message}
              <button
                type="button"
                className="btn-close"
                onClick={() => setAlert(null)}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row">
              <div className="col-8 col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a new task..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                />
              </div>
              <div className="col-4 col-sm-3">
                <button type="submit" className="btn btn-primary w-100">
                  Add Task
                </button>
              </div>
            </div>
          </form>

          {tasks.length > 0 ? (
            <TaskList
              tasks={tasks}
              onToggleComplete={toggleTaskComplete}
              onDeleteTask={deleteTask}
            />
          ) : (
            <div className="alert alert-info text-center">
              No tasks yet. Add your first task above or use the voice button!
            </div>
          )}

          <VoiceButton onVoiceResult={handleVoiceResult} />
        </div>
      </div>
    </div>
  );
}