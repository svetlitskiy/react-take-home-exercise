import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskManager from './TaskManager';
import { IdbTask } from '../services/idb/idb-task';
import { TaskManagerTaskInterface } from '../interfaces/task-manager.interface';
import '@testing-library/jest-dom';

// Мокируем IdbTask
jest.mock('../services/idb/idb-task');

const mockTasks: TaskManagerTaskInterface[] = [
  { id: '1', title: 'Task 1', completed: false },
  { id: '2', title: 'Task 2', completed: true },
];

describe('TaskManager', () => {
  beforeEach(() => {
    // Мокируем методы IdbTask
    (IdbTask.getInstance as jest.Mock).mockResolvedValue({
      add: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      list: jest.fn().mockResolvedValue(mockTasks),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the TaskManager component', async () => {
    render(<TaskManager />);
    expect(screen.getByPlaceholderText('New task...')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('displays tasks after loading', async () => {
    render(<TaskManager />);
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('filters tasks correctly', async () => {
    render(<TaskManager />);

    // Проверяем, что все задачи отображаются
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    // Фильтруем по завершенным задачам
    fireEvent.click(screen.getByText('Completed'));
    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    // Фильтруем по незавершенным задачам
    fireEvent.click(screen.getByText('Pending'));
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });

    // Возвращаемся к отображению всех задач
    fireEvent.click(screen.getByText('All'));
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('adds a new task', async () => {
    render(<TaskManager />);

    const input = screen.getByPlaceholderText('New task...');
    const addButton = screen.getByText('Add');

    // Вводим текст в поле ввода
    fireEvent.change(input, { target: { value: 'New Task' } });
    expect(input).toHaveValue('New Task');

    // Нажимаем кнопку "Add"
    fireEvent.click(addButton);

    // Проверяем, что метод add был вызван
    await waitFor(async () => {
      const instance = await IdbTask.getInstance();
      expect(instance.add).toHaveBeenCalledWith('New Task');
    });
  });

  it('deletes a task', async () => {
    render(<TaskManager />);

    // Ждем, пока задачи загрузятся
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Находим кнопку удаления и кликаем по ней
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Проверяем, что метод delete был вызван
    await waitFor(async () => {
      const instance = await IdbTask.getInstance();
      expect(instance.delete).toHaveBeenCalledWith('1');
    });
  });

  it('toggles task completion', async () => {
    render(<TaskManager />);

    // Ждем, пока задачи загрузятся
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Находим задачу и кликаем по ней
    const taskElement = screen.getByText('Task 1');
    fireEvent.click(taskElement);

    // Проверяем, что состояние задачи изменилось
    await waitFor(() => {
      expect(taskElement).toHaveClass('line-through');
    });
  });
});
