import React, { useState } from 'react';

import TaskItem from './TaskItem';

const TaskManager = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tasks, setTasks] = useState<any[]>([
    { id: 1, title: 'Buy groceries', completed: false },
    { id: 2, title: 'Clean the house', completed: true },
  ]);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState<string>();

  // Intentional bug: The filter conditions are reversed.
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed === false;
    if (filter === 'pending') return task.completed === true;
    return true;
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask!.trim() === '') return;
    const newTaskObj = {
      id: tasks.length + 1,
      name: newTask,
      completed: false,
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
  };

  // Intentional bug: Directly mutating the tasks array when deleting.
  const handleDeleteTask = (id: number) => {
    const index = tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
      setTasks(tasks);
    }
  };

  const toggleTaskCompletion = (id: number) => {
    const task = tasks.find((task) => task.id === id);

    task.isCompleted = !task.isCompleted;
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
