import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import CountdownButton from '../../src/components/CountdownButton';

describe('CountdownButton Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('UI-CountdownButton acceptanceCriteria', () => {
    test('应该渲染获取验证码按钮', () => {
      render(<CountdownButton onClick={() => {}} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('获取验证码');
    });

    test('点击后应该开始60秒倒计时', async () => {
      const mockOnClick = vi.fn();
      render(<CountdownButton onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // 验证onClick被调用
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      
      // 验证倒计时开始
      expect(button).toHaveTextContent('60秒后重新获取');
      
      // 模拟时间流逝
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(button).toHaveTextContent('59秒后重新获取');
      });
    });

    test('倒计时期间按钮应该不可点击', () => {
      const mockOnClick = vi.fn();
      render(<CountdownButton onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // 倒计时期间按钮应该被禁用
      expect(button).toBeDisabled();
      
      // 再次点击不应该触发onClick
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1); // 仍然只调用了一次
    });

    test('倒计时结束后应该恢复可点击状态', async () => {
      const mockOnClick = vi.fn();
      render(<CountdownButton onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // 快进60秒
      vi.advanceTimersByTime(60000);
      
      await waitFor(() => {
        expect(button).toHaveTextContent('获取验证码');
        expect(button).not.toBeDisabled();
      });
      
      // 应该可以再次点击
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(2);
    });

    test('disabled属性应该禁用按钮', () => {
      render(<CountdownButton onClick={() => {}} disabled={true} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('countdown属性应该显示指定的倒计时时间', () => {
      render(<CountdownButton onClick={() => {}} countdown={30} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(button).toHaveTextContent('30秒后重新获取');
    });

    test('倒计时过程中应该显示正确的剩余时间', async () => {
      render(<CountdownButton onClick={() => {}} countdown={5} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // 检查每一秒的倒计时
      for (let i = 5; i > 0; i--) {
        expect(button).toHaveTextContent(`${i}秒后重新获取`);
        vi.advanceTimersByTime(1000);
        await waitFor(() => {});
      }
      
      // 倒计时结束
      await waitFor(() => {
        expect(button).toHaveTextContent('获取验证码');
      });
    });
  });
});