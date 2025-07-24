import * as chrono from 'chrono-node';

export function parseTaskWithDate(text: string): { taskText: string; dueDate?: Date } {
  const parsed = chrono.parse(text);
  
  if (parsed.length > 0) {
    const dateResult = parsed[0];
    const dueDate = dateResult.start.date();
    
    // Remove the date text from the task
    const taskText = text.replace(dateResult.text, '').trim();
    
    return {
      taskText: taskText || text, // Fallback to original text if empty
      dueDate
    };
  }
  
  return { taskText: text };
}