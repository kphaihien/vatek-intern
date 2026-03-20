import { render, screen, fireEvent } from '@testing-library/react';
import Task from '../components/Task';

const mockTask = { id: 1, title: 'Learn Something', completed: false };
const completedTask = { id: 2, title: 'Learn Something Else', completed: true };

const defaultProps = {
  task: mockTask,
  setSelectedTask: jest.fn(),
  selectedTask: null,
  toogleTask: jest.fn(),
  editTask: jest.fn(),
};

describe('Task', () => {
  it('render task title', () => {
    render(<Task {...defaultProps} />);
    expect(screen.getByText('Learn Something')).toBeInTheDocument();
  });

  it('render checkedbox checked for completed task', () => {
    render(<Task {...defaultProps} task={completedTask} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('render checkedbox unchecked for uncompleted task ', () => {
    render(<Task {...defaultProps} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('call toggleTask when user clicks checkedbox ', () => {
    render(<Task {...defaultProps} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(defaultProps.toogleTask).toHaveBeenCalledWith(mockTask.id);
  });
  it('shows input field when editing', () => {
    render(<Task {...defaultProps} selectedTask={mockTask.id} />);
    fireEvent.click(screen.getByRole('button'));
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });
});
