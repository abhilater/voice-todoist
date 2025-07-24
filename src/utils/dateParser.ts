import * as chrono from 'chrono-node';

export function parseTaskWithDate(text: string): { title: string; dueDate?: Date } {
  const parsed = chrono.parse(text);
  
  if (parsed.length > 0) {
    const dateResult = parsed[0];
    const dueDate = dateResult.start.date();
    
    // Remove the date text from the task
    const title = text.replace(dateResult.text, '').trim();
    
    return {
      title: title || text, // Fallback to original text if empty
      dueDate
    };
  }
  
  return { title: text };
}