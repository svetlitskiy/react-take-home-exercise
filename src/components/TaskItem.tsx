import React from 'react';
import { TaskManagerTaskInterface } from '../interfaces/task-manager.interface';

const TaskItem = ({
  task,
  onDelete,
  onToggle,
}: {
  task: TaskManagerTaskInterface;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}) => {
  return (
    <li className="flex items-center justify-between border-b py-2">
      <span
        onClick={() => onToggle(task.id)}
        className={`cursor-pointer ${
          task.completed ? 'line-through text-green-500' : 'text-black'
        }`}
      >
        {task.title}
      </span>

      <button onClick={() => onDelete(task.id)} className="bg-red-500 text-white py-1 px-2 rounded">
        Delete
      </button>
    </li>
  );
};

export default TaskItem;
