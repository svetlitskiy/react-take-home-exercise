import React, { useState } from 'react';

import TaskItem from './TaskItem';
import { TaskManagerTaskInterface } from '../interfaces/task-manager.interface';

const TaskManager = () => {
  const [tasks, setTasks] = useState<TaskManagerTaskInterface[]>([
    { id: 1, title: 'Buy groceries', completed: false },
    { id: 2, title: 'Clean the house', completed: true },
  ]);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState<string>('');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed === true;
    if (filter === 'pending') return task.completed === false;
    return true;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const newTaskObj: TaskManagerTaskInterface = {
      id: tasks.length + 1,
      title: newTask,
      completed: false,
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: number) => {
    const newTasks: TaskManagerTaskInterface[] = [...tasks];
    const index = newTasks.findIndex((task: TaskManagerTaskInterface) => task.id === id);
    if (index > -1) {
      newTasks[index].completed = !newTasks[index].completed;
      setTasks(newTasks);
    }
  };

  return (
    <div className="container mx-auto bg-white p-4 rounded shadow">
      <form onSubmit={handleAddTask} className="mb-4 flex">
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow border rounded-l py-2 px-3"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">
          Add
        </button>
      </form>
      <div className="flex justify-around mb-4">
        <button onClick={() => setFilter('all')} className="text-gray-700">
          All
        </button>
        <button onClick={() => setFilter('completed')} className="text-gray-700">
          Completed
        </button>
        <button onClick={() => setFilter('pending')} className="text-gray-700">
          Pending
        </button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            onToggle={toggleTaskCompletion}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
