// import { render, screen, fireEvent } from '@testing-library/react';
// import Task from '../components/Task';

// const mockTask = { id: 1, title: 'Learn Something', completed: false };
// const completedTask = { id: 2, title: 'Learn Something Else', completed: true };

// const defaultProps = {
//   task: mockTask,
//   setSelectedTask: jest.fn(),
//   selectedTask: null,
//   toogleTask: jest.fn(),
//   editTask: jest.fn(),
// };

// describe('Task', () => {
//   it('render task title', () => {
//     render(<Task {...defaultProps} />);
//     expect(screen.getByText('Learn Something')).toBeInTheDocument();
//   });

//   it('render checkedbox checked for completed task', () => {
//     render(<Task {...defaultProps} task={completedTask} />);
//     expect(screen.getByRole('checkbox')).toBeChecked();
//   });

//   it('render checkedbox unchecked for uncompleted task ', () => {
//     render(<Task {...defaultProps} />);
//     expect(screen.getByRole('checkbox')).not.toBeChecked();
//   });

//   it('call toggleTask when user clicks checkedbox ', () => {
//     render(<Task {...defaultProps} />);
//     fireEvent.click(screen.getByRole('checkbox'));
//     expect(defaultProps.toogleTask).toHaveBeenCalledWith(mockTask.id);
//   });
//   it('shows input field when editing', () => {
//     render(<Task {...defaultProps} selectedTask={mockTask.id} />);
//     fireEvent.click(screen.getByRole('button'));
//     const inputs = screen.getAllByRole('textbox');
//     expect(inputs.length).toBeGreaterThan(0);
//   });
// });


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Task from '../components/Task';

// ─── Mock i18n ────────────────────────────────────────────────────────────────
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const mockTask     = { id: 1, title: 'Learn Something',      completed: false };
const completedTask = { id: 2, title: 'Learn Something Else', completed: true  };

const buildProps = (overrides = {}) => {
  return {
    task:            mockTask,
    setSelectedTask: jest.fn(),
    selectedTask:    null,
    toogleTask:      jest.fn(),
    editTask:        jest.fn(),
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('Task component', () => {

  // ── Rendering ───────────────────────────────────────────────────────────────
  describe('Rendering', () => {
    it('hiển thị tiêu đề task', () => {
      render(<Task {...buildProps()} />);
      expect(screen.getByText('Learn Something')).toBeInTheDocument();
    });

    it('checkbox được check khi task đã hoàn thành', () => {
      render(<Task {...buildProps({ task: completedTask })} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('checkbox không được check khi task chưa hoàn thành', () => {
      render(<Task {...buildProps()} />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('tiêu đề có gạch ngang khi task đã hoàn thành', () => {
      render(<Task {...buildProps({ task: completedTask })} />);
      expect(screen.getByText('Learn Something Else')).toHaveClass('line-through');
    });

    it('hiển thị emailSender nếu có', () => {
      const task = { ...mockTask, emailSender: 'user@example.com' };
      render(<Task {...buildProps({ task })} />);
      expect(screen.getByText(/user@example\.com/)).toBeInTheDocument();
    });

    it('hiển thị fallback "todo.undefined" nếu không có emailSender', () => {
      render(<Task {...buildProps()} />);
      expect(screen.getByText(/todo\.undefined/)).toBeInTheDocument();
    });

    it('không hiển thị nút edit khi task chưa được chọn', () => {
      render(<Task {...buildProps({ selectedTask: null })} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('hiển thị nút edit (svg) khi task đang được chọn', () => {
      render(<Task {...buildProps({ selectedTask: mockTask.id })} />);
      // SVG edit button render trong div, truy cập qua svg element
      expect(document.querySelector('svg')).toBeInTheDocument();
    });
  });

  // ── Interactions ────────────────────────────────────────────────────────────
  describe('Interactions', () => {
    it('gọi setSelectedTask khi click vào task', () => {
      const props = buildProps();
      render(<Task {...props} />);
      fireEvent.click(screen.getByText('Learn Something'));
      expect(props.setSelectedTask).toHaveBeenCalledWith(mockTask.id);
    });

    it('gọi toogleTask khi click checkbox', () => {
      const props = buildProps();
      render(<Task {...props} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(props.toogleTask).toHaveBeenCalledWith(mockTask.id);
    });

    it('click checkbox không lan lên gọi setSelectedTask', () => {
      const props = buildProps();
      render(<Task {...props} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(props.setSelectedTask).not.toHaveBeenCalled();
    });
  });

  // ── Editing ─────────────────────────────────────────────────────────────────
  describe('Editing', () => {
    it('hiển thị input text khi click nút edit', () => {
      render(<Task {...buildProps({ selectedTask: mockTask.id })} />);
      fireEvent.click(document.querySelector('svg'));
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('ẩn tiêu đề span khi đang chỉnh sửa', () => {
      render(<Task {...buildProps({ selectedTask: mockTask.id })} />);
      fireEvent.click(document.querySelector('svg'));
      expect(screen.queryByText('Learn Something')).not.toBeInTheDocument();
    });

    it('input edit có giá trị ban đầu là tiêu đề task', () => {
      render(<Task {...buildProps({ selectedTask: mockTask.id })} />);
      fireEvent.click(document.querySelector('svg'));
      expect(screen.getByRole('textbox')).toHaveValue('Learn Something');
    });

    it('cập nhật giá trị input khi gõ', () => {
      render(<Task {...buildProps({ selectedTask: mockTask.id })} />);
      fireEvent.click(document.querySelector('svg'));
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'New Title' } });
      expect(input).toHaveValue('New Title');
    });

    it('gọi editTask và thoát chế độ edit khi nhấn Enter', () => {
      const props = buildProps({ selectedTask: mockTask.id });
      render(<Task {...props} />);
      fireEvent.click(document.querySelector('svg'));
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Updated Title' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(props.editTask).toHaveBeenCalledWith(mockTask.id, 'Updated Title');
      // Sau khi Enter, input edit biến mất
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('không gọi editTask khi nhấn phím khác (không phải Enter)', () => {
      const props = buildProps({ selectedTask: mockTask.id });
      render(<Task {...props} />);
      fireEvent.click(document.querySelector('svg'));
      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(props.editTask).not.toHaveBeenCalled();
    });

    it('click lại nút edit lần 2 để thoát chế độ edit (toggle)', () => {
      render(<Task {...buildProps({ selectedTask: mockTask.id })} />);
      const svg = document.querySelector('svg');
      fireEvent.click(svg); // 
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      fireEvent.click(svg); //
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });
});