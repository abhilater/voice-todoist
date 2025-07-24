'use client';
import { Task } from '@/types';
import { useState } from 'react';
import { ListGroup, Button, Badge, Form, FormControl, InputGroup } from 'react-bootstrap';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, newTitle: string, newDescription: string, newDueDate: Date) => void;
}

export default function TaskList({ tasks, onToggleComplete, onDeleteTask, onUpdateTask }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const formatDueDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getDueDateColor = (dueDate: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (dueDate.toDateString() === today.toDateString()) {
      return 'danger'; // Red for today
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'warning'; // Yellow for tomorrow
    } else {
      return 'primary'; // Blue for other dates
    }
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const description = (form.elements.namedItem('description') as HTMLInputElement).value;
    const dueDate = new Date((form.elements.namedItem('dueDate') as HTMLInputElement).value);
    onUpdateTask(id, title, description, dueDate);
    setEditingTaskId(null);
  };

  return (
    <ListGroup>
      {tasks.map((task) => (
        <ListGroup.Item
          key={task.id}
          className={`task-item d-flex justify-content-between align-items-center ${
            task.completed ? 'completed-task' : ''
          }`}
        >
          {editingTaskId === task.id ? (
            <Form onSubmit={(e) => handleUpdate(e, task.id)} className="flex-grow-1">
              <InputGroup className="mb-3">
                <FormControl
                  name="title"
                  defaultValue={task.title}
                  aria-label="Task title"
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <FormControl
                  name="description"
                  defaultValue={task.description}
                  as="textarea"
                  aria-label="Task description"
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <FormControl
                  name="dueDate"
                  type="datetime-local"
                  defaultValue={task.dueDate ? task.dueDate.toISOString().substring(0, 16) : ''}
                  aria-label="Task due date"
                />
              </InputGroup>
              <Button type="submit" variant="primary" size="sm">Save</Button>
              <Button variant="secondary" size="sm" onClick={() => setEditingTaskId(null)} className="ms-2">Cancel</Button>
            </Form>
          ) : (
            <div className="flex-grow-1">
              <span
                className={`task-text ${task.completed ? 'text-muted' : ''}`}
                onClick={() => onToggleComplete(task.id)}
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                {task.title}
              </span>
              {task.description && <p className="text-muted">{task.description}</p>}
              {task.dueDate && (
                <Badge bg={getDueDateColor(task.dueDate)} className="ms-2">
                  Due: {formatDueDate(task.dueDate)}
                </Badge>
              )}
            </div>
          )}
          <div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setEditingTaskId(task.id)}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDeleteTask(task.id)}
              className="ms-2"
            >
              Delete
            </Button>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}