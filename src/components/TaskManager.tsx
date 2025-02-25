import React, { useEffect, useState } from 'react';

import TaskItem from './TaskItem';
import { TaskManagerTaskInterface } from '../interfaces/task-manager.interface';
import { IdbTask } from '../services/idb/idb-task';
import { clsx } from 'clsx';

enum FilterType {
  ALL = 'All',
  COMPLETED = 'Completed',
  PENDING = 'Pending',
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<TaskManagerTaskInterface[]>([]);
  const [filter, setFilter] = useState(FilterType.ALL);
  const [newTask, setNewTask] = useState<string>('');

  const filteredTasks = tasks.filter((task) => {
    if (filter === FilterType.COMPLETED) return task.completed === true;
    if (filter === FilterType.PENDING) return task.completed === false;
    if (filter === FilterType.ALL) return true;
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newTask.trim() === '') return;
      await (await IdbTask.getInstance()).add(newTask);
      await updateTaskList();
      setNewTask('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await (await IdbTask.getInstance()).delete(id);
      await updateTaskList();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTaskCompletion = (id: string) => {
    try {
      const newTasks: TaskManagerTaskInterface[] = [...tasks];
      const index = newTasks.findIndex((task: TaskManagerTaskInterface) => task.id === id);
      if (index > -1) {
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaskList = async (): Promise<void> => {
    try {
      const list = await (await IdbTask.getInstance()).list();
      setTasks(list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateTaskList();
  }, []);

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
      <div className="flex flex-row mb-4">
        <button
          onClick={() => setFilter(FilterType.ALL)}
          className={clsx('flex basis-1/3 text-gray-700 justify-center', {
            'bg-gray-200': filter === FilterType.ALL,
          })}
        >
          All
        </button>
        <button
          onClick={() => setFilter(FilterType.COMPLETED)}
          className={clsx('flex basis-1/3 text-gray-700 justify-center', {
            'bg-gray-200': filter === FilterType.COMPLETED,
          })}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter(FilterType.PENDING)}
          className={clsx('flex basis-1/3 text-gray-700 justify-center', {
            'bg-gray-200': filter === FilterType.PENDING,
          })}
        >
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
