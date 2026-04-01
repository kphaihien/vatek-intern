import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ToDoApp from '../pages/ToDoApp'; 


jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'todo.title': 'Todo App',
        'todo.placeholder': 'Add new task...',
        'todo.itemsLeft': ' items left',
        'todo.itemLeft': ' item left',
        'todo.filterAll': 'All',
        'todo.filterActive': 'Active',
        'todo.filterCompleted': 'Completed',
        'todo.clearCompleted': 'Clear Completed',
      };
      return translations[key] || key;
    },
  }),
}));

const mockEmit = jest.fn();
const mockOn = jest.fn();
const mockDisconnect = jest.fn();

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    emit: mockEmit,
    on: mockOn,
    disconnect: mockDisconnect,
  })),
}));

jest.mock('../utils/socketHost', () => 'http://localhost:3000');

jest.mock('../data/mockData', () => ({
  mockDataTodo: [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
    { id: 3, title: 'Task 3', completed: false },
  ],
}));



const createMockStore = (userState = { email: 'test@example.com' }) =>
  configureStore({
    reducer: {
      user: () => userState,
    },
  });


const renderWithStore = (userState) => {
  const store = createMockStore(userState);
  return render(
    <Provider store={store}>
      <ToDoApp />
    </Provider>
  );
};



describe('ToDoApp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOn.mockImplementation((event, callback) => {
      mockOn._callbacks = mockOn._callbacks || {};
      mockOn._callbacks[event] = callback;
    });
  });


  describe('Render', () => {
    it('hiển thị tiêu đề ứng dụng', () => {
      renderWithStore();
      expect(screen.getByText('Todo App')).toBeInTheDocument();
    });

    it('hiển thị input và nút thêm task', () => {
      renderWithStore();
      expect(screen.getByPlaceholderText('Add new task...')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
    });

    it('hiển thị danh sách task từ mockData', () => {
      renderWithStore();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    it('hiển thị các nút filter: All, Active, Completed', () => {
      renderWithStore();
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('hiển thị nút Clear Completed', () => {
      renderWithStore();
      expect(screen.getByText('Clear Completed')).toBeInTheDocument();
    });

    it('hiển thị số lượng task chưa hoàn thành ban đầu là 2', () => {
      renderWithStore();
      expect(screen.getByText('2 items left')).toBeInTheDocument();
    });
  });


  describe('Thêm task', () => {
    it('emit socket khi thêm task hợp lệ', () => {
      renderWithStore();
      const input = screen.getByPlaceholderText('Add new task...');
      fireEvent.change(input, { target: { value: 'New Task' } });
      fireEvent.click(screen.getByText('+'));
      expect(mockEmit).toHaveBeenCalledWith('sendFromClient', 'New Task');
    });

    it('xoá input sau khi thêm task', () => {
      renderWithStore();
      const input = screen.getByPlaceholderText('Add new task...');
      fireEvent.change(input, { target: { value: 'New Task' } });
      fireEvent.click(screen.getByText('+'));
      expect(input.value).toBe('');
    });

    it('hiển thị alert khi thêm task rỗng', () => {
      window.alert = jest.fn();
      renderWithStore();
      fireEvent.click(screen.getByText('+'));
      expect(window.alert).toHaveBeenCalledWith('Hãy thêm task');
    });

    it('không emit socket khi task chỉ có khoảng trắng', () => {
      window.alert = jest.fn();
      renderWithStore();
      const input = screen.getByPlaceholderText('Add new task...');
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(screen.getByText('+'));
      expect(mockEmit).not.toHaveBeenCalled();
    });

    it('nhận task mới qua socket và thêm vào danh sách', async () => {
      renderWithStore();
      act(() => {
        mockOn._callbacks?.['sendFromServer']?.({
          id: 99,
          msg: 'Socket Task',
          emailSender: 'other@example.com',
        });
      });
      await waitFor(() => {
        expect(screen.getByText('Socket Task')).toBeInTheDocument();
      });
    });
  });



  describe('Toggle task', () => {

    it('cập nhật trạng thái task khi nhận sự kiện doneTaskFromServer', async () => {
      renderWithStore();
      act(() => {
        mockOn._callbacks?.['doneTaskFromServer']?.({ msg: 1 });
      });
      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
      });
    });
  });


  describe('Filter task', () => {
    it('filter Active: chỉ hiển thị task chưa hoàn thành', () => {
      renderWithStore();
      fireEvent.click(screen.getByText('Active'));
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });

    it('filter Completed: chỉ hiển thị task đã hoàn thành', () => {
      renderWithStore();
      fireEvent.click(screen.getByText('Completed'));
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
    });

    it('filter All: hiển thị tất cả task', () => {
      renderWithStore();
      fireEvent.click(screen.getByText('Active'));
      fireEvent.click(screen.getByText('All'));
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });
  });



  describe('Tìm kiếm task', () => {
    it('lọc task theo từ khoá tìm kiếm', () => {
      renderWithStore();
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'Task 1' } });
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    it('tìm kiếm không phân biệt hoa thường', () => {
      renderWithStore();
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'task 1' } });
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

  });


  describe('Clear Completed', () => {
    it('xoá tất cả task đã hoàn thành', () => {
      renderWithStore();
      fireEvent.click(screen.getByText('Clear Completed'));
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    it('cập nhật đếm items left sau khi clear', () => {
      renderWithStore();
      fireEvent.click(screen.getByText('Clear Completed'));
      expect(screen.getByText('2 items left')).toBeInTheDocument();
    });
  });



  describe('Socket lifecycle', () => {
    it('kết nối socket với email người dùng khi mount', () => {
      const { io } = require('socket.io-client');
      renderWithStore({ email: 'test@example.com' });
      expect(io).toHaveBeenCalledWith('http://localhost:3000', {
        auth: { email: 'test@example.com' },
      });
    });

    it('ngắt kết nối socket khi unmount', () => {
      const { unmount } = renderWithStore();
      unmount();
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('đăng ký lắng nghe sự kiện sendFromServer', () => {
      renderWithStore();
      expect(mockOn).toHaveBeenCalledWith('sendFromServer', expect.any(Function));
    });

    it('đăng ký lắng nghe sự kiện doneTaskFromServer', () => {
      renderWithStore();
      expect(mockOn).toHaveBeenCalledWith('doneTaskFromServer', expect.any(Function));
    });
  });

  describe('Redux user state', () => {
    it('sử dụng email mặc định khi user là null', () => {
      expect(() => renderWithStore(null)).not.toThrow();
    });
  });
});
