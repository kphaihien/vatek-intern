import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  it('renders input and button', () => {
    render(<SearchBar setSearchValue={jest.fn()} />);
    expect(screen.getByPlaceholderText('todo.search')).toBeInTheDocument();
    expect(screen.getByText('todo.search')).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<SearchBar setSearchValue={jest.fn()} />);
    const input = screen.getByPlaceholderText('todo.search');
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(input.value).toBe('hello');
  });

  it('calls setSearchValue with input value on button click', () => {
    const mockSetSearchValue = jest.fn();
    render(<SearchBar setSearchValue={mockSetSearchValue} />);
    const input = screen.getByPlaceholderText('todo.search');
    fireEvent.change(input, { target: { value: 'nguyen' } });
    fireEvent.click(screen.getByText('todo.search'));
    expect(mockSetSearchValue).toHaveBeenCalledWith('nguyen');
  });

  it('calls setSearchValue with empty string ', () => {
    const mockSetSearchValue = jest.fn();
    render(<SearchBar setSearchValue={mockSetSearchValue} />);
    fireEvent.click(screen.getByText('todo.search'));
    expect(mockSetSearchValue).toHaveBeenCalledWith('');
  });
});
