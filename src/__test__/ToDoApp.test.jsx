import { render, screen, fireEvent } from '@testing-library/react';
import ToDoApp from '../pages/ToDoApp';

describe('ToDoApp', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => jest.clearAllMocks());

  it('renders initial tasks', () => {
    render(<ToDoApp />);
    expect(screen.getByText('Learn React')).toBeInTheDocument();
    expect(screen.getByText('Build a Todo App')).toBeInTheDocument();
  });

  it('adds a new task', () => {
    render(<ToDoApp />);
    const input = screen.getByPlaceholderText('todo.placeholder');
    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('clears input after adding task', () => {
    render(<ToDoApp />);
    const input = screen.getByPlaceholderText('todo.placeholder');
    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('+'));
    expect(input.value).toBe('');
  });

  it('shows alert when adding empty task', () => {
    render(<ToDoApp />);
    fireEvent.click(screen.getByText('+'));
    expect(window.alert).toHaveBeenCalledWith('Hãy thêm task');
  });

  it('filters active tasks', () => {
    render(<ToDoApp />);
    fireEvent.click(screen.getByText('todo.filterActive'));
    expect(screen.getByText('Build a Todo App')).toBeInTheDocument();
    expect(screen.queryByText('Learn React')).not.toBeInTheDocument();
  });

  it('filters completed tasks', () => {
    render(<ToDoApp />);
    fireEvent.click(screen.getByText('todo.filterCompleted'));
    expect(screen.getByText('Learn React')).toBeInTheDocument();
    expect(screen.queryByText('Build a Todo App')).not.toBeInTheDocument();
  });

  it('shows all tasks when All filter selected', () => {
    render(<ToDoApp />);
    fireEvent.click(screen.getByText('todo.filterActive'));
    fireEvent.click(screen.getByText('todo.filterAll'));
    expect(screen.getByText('Learn React')).toBeInTheDocument();
    expect(screen.getByText('Build a Todo App')).toBeInTheDocument();
  });

  it('clears completed tasks', () => {
    render(<ToDoApp />);
    fireEvent.click(screen.getByText('todo.clearCompleted'));
    expect(screen.queryByText('Learn React')).not.toBeInTheDocument();
    expect(screen.getByText('Build a Todo App')).toBeInTheDocument();
  });

  it('toggles a task from active to completed', () => {
    render(<ToDoApp />);
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
  });
});
