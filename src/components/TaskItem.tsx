import React from 'react';
import { TaskManagerTaskInterface } from '../interfaces/task-manager.interface';
import { clsx } from 'clsx';

const TaskItem = ({
  task,
  onDelete,
  onToggle,
}: {
  task: TaskManagerTaskInterface;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) => {
  return (
    <li className="flex items-center justify-between border-b py-2">
      <span
        onClick={() => onToggle(task.id)}
        className={clsx(
          `cursor-pointer`,
          task.completed ? 'line-through text-green-500' : 'text-black',
        )}
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
