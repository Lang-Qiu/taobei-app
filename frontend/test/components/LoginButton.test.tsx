import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import LoginButton from '../../src/components/LoginButton';

describe('LoginButton Component', () => {
  describe('UI-LoginButton acceptanceCriteria', () => {
    test('应该渲染登录按钮', () => {
      render(<LoginButton onClick={() => {}} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('登录');
    });

    test('点击时应该调用onClick回调', () => {
      const mockOnClick = vi.fn();
      render(<LoginButton onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('disabled状态下应该禁用按钮', () => {
      const mockOnClick = vi.fn();
      render(<LoginButton onClick={mockOnClick} disabled={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      // 点击不应该触发onClick
      fireEvent.click(button);
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    test('loading状态下应该显示加载中文本', () => {
      render(<LoginButton onClick={() => {}} loading={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('登录中...');
    });

    test('loading状态下应该禁用按钮', () => {
      const mockOnClick = vi.fn();
      render(<LoginButton onClick={mockOnClick} loading={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      // 点击不应该触发onClick
      fireEvent.click(button);
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    test('loading状态下应该显示加载图标', () => {
      render(<LoginButton onClick={() => {}} loading={true} />);
      
      // 检查是否有加载图标的元素
      const loadingIcon = screen.getByText('⏳');
      expect(loadingIcon).toBeInTheDocument();
    });

    test('非loading状态下不应该显示加载图标', () => {
      render(<LoginButton onClick={() => {}} loading={false} />);
      
      // 不应该有加载图标
      const loadingIcon = screen.queryByText('⏳');
      expect(loadingIcon).not.toBeInTheDocument();
    });

    test('同时设置disabled和loading时应该优先显示loading状态', () => {
      render(<LoginButton onClick={() => {}} disabled={true} loading={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('登录中...');
      expect(button).toBeDisabled();
    });
  });
});