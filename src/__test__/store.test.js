import { render, screen, fireEvent } from '@testing-library/react';
import ToDoApp from '../pages/ToDoApp';
import { store } from '../redux/store';
describe('Redux Store', () => {
  afterEach(() => jest.clearAllMocks());
  it('initial store', () => {
    const state = store.getState();
    expect(state.employees.employeeList).toEqual([]);
  });
});
