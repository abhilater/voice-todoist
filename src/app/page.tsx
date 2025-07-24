'use client';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import TaskList from '@/components/TaskList';
import VoiceButton from '@/components/VoiceButton';
import { Task } from '@/types';
import { parseTaskWithDate } from '@/utils/dateParser';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('voice-todoist-tasks');
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      setTasks(parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      })));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('voice-todoist-tasks', JSON.stringify(tasks));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(newTaskText);
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Voice Todoist Clone</h1>
          
          {alert && (
            <Alert variant={alert.type} dismissible onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="mb-4">
            <Row>
              <Col xs={8} sm={9}>
                <Form.Control
                  type="text"
                  placeholder="Add a new task..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                />
              </Col>
              <Col xs={4} sm={3}>
                <Button type="submit" variant="primary" className="w-100">
                  Add Task
                </Button>
              </Col>
            </Row>
          </Form>

          {tasks.length > 0 ? (
            <TaskList
              tasks={tasks}
              onToggleComplete={toggleTaskComplete}
              onDeleteTask={deleteTask}
            />
          ) : (
            <Alert variant="info" className="text-center">
              No tasks yet. Add your first task above or use the voice button!
            </Alert>
          )}

          <VoiceButton onVoiceResult={handleVoiceResult} />
        </Col>
      </Row>
    </Container>
  );
}