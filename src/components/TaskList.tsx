'use client';
import { Task } from '@/types';
import { ListGroup, Button, Badge } from 'react-bootstrap';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskList({ tasks, onToggleComplete, onDeleteTask }: TaskListProps) {
  const formatDueDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
          <div className="flex-grow-1">
            <span
              className={`task-text ${task.completed ? 'text-muted' : ''}`}
              onClick={() => onToggleComplete(task.id)}
              style={{ cursor: 'pointer' }}
            >
              {task.text}
            </span>
            {task.dueDate && (
              <Badge bg="secondary" className="ms-2">
                Due: {formatDueDate(task.dueDate)}
              </Badge>
            )}
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDeleteTask(task.id)}
          >
            Delete
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}