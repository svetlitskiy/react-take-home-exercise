import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from './TaskItem';
import { TaskManagerTaskInterface } from '../interfaces/task-manager.interface';
import '@testing-library/jest-dom';

const mockTask: TaskManagerTaskInterface = {
  id: '1',
  title: 'Test Task',
  completed: false,
};

describe('TaskItem', () => {
  it('renders the task title', () => {
    render(<TaskItem task={mockTask} onDelete={() => {}} onToggle={() => {}} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('renders the task with a line-through when completed', () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskItem task={completedTask} onDelete={() => {}} onToggle={() => {}} />);
    const taskElement = screen.getByText('Test Task');
    expect(taskElement).toHaveClass('line-through');
    expect(taskElement).toHaveClass('text-green-500');
  });

  it('calls onToggle when the task title is clicked', () => {
    const onToggleMock = jest.fn();
    render(<TaskItem task={mockTask} onDelete={() => {}} onToggle={onToggleMock} />);
    fireEvent.click(screen.getByText('Test Task'));
    expect(onToggleMock).toHaveBeenCalledWith('1');
  });

  it('calls onDelete when the delete button is clicked', () => {
    const onDeleteMock = jest.fn();
    render(<TaskItem task={mockTask} onDelete={onDeleteMock} onToggle={() => {}} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(onDeleteMock).toHaveBeenCalledWith('1');
  });
});
