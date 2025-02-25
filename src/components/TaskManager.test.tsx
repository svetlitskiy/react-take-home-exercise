import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TaskManager from './TaskManager';
import { IdbTask } from '../services/idb/idb-task';
import '@testing-library/jest-dom';

jest.mock('../services/idb/idb-task');

const mockTasks = [
  { id: '1', title: 'Task 1', completed: false },
  { id: '2', title: 'Task 2', completed: true },
];

describe('TaskManager', () => {
  let idbInstance: {
    add: jest.Mock;
    delete: jest.Mock;
    edit: jest.Mock;
    list: jest.Mock;
  };

  beforeEach(() => {
    idbInstance = {
      add: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      edit: jest.fn().mockResolvedValue(undefined),
      list: jest.fn().mockResolvedValue(mockTasks),
    };
    (IdbTask.getInstance as jest.Mock).mockResolvedValue(idbInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the TaskManager component', async () => {
    await act(async () => {
      render(<TaskManager />);
    });
    expect(screen.getByPlaceholderText('New task...')).toBeInTheDocument();
  });

  it('displays tasks after loading', async () => {
    await act(async () => {
      render(<TaskManager />);
    });
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('adds a new task', async () => {
    await act(async () => {
      render(<TaskManager />);
    });

    const input = screen.getByPlaceholderText('New task...');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'New Task' } });
    await act(async () => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(idbInstance.add).toHaveBeenCalledWith('New Task');
    });
  });

  it('deletes a task', async () => {
    await act(async () => {
      render(<TaskManager />);
    });

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(idbInstance.delete).toHaveBeenCalledWith('1');
    });
  });

  it('toggles task completion', async () => {
    await act(async () => {
      render(<TaskManager />);
    });

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const taskElement = screen.getByText('Task 1');
    await act(async () => {
      fireEvent.click(taskElement);
    });

    await waitFor(() => {
      expect(idbInstance.edit).toHaveBeenCalledWith('1', { completed: true });
    });
  });

  it('filters tasks correctly', async () => {
    await act(async () => {
      render(<TaskManager />);
    });

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Completed'));
    });
    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Pending'));
    });
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('All'));
    });
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });
});
