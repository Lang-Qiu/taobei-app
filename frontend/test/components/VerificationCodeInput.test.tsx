import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import VerificationCodeInput from '../../src/components/VerificationCodeInput';

describe('VerificationCodeInput Component', () => {
  describe('UI-VerificationCodeInput acceptanceCriteria', () => {
    test('应该渲染验证码输入框', () => {
      render(<VerificationCodeInput value="" onChange={() => {}} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', '请输入验证码');
    });

    test('应该只允许输入数字', () => {
      const mockOnChange = vi.fn();
      render(<VerificationCodeInput value="" onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      
      // 尝试输入字母和数字
      fireEvent.change(input, { target: { value: 'abc123def' } });
      
      // 应该只保留数字
      expect(mockOnChange).toHaveBeenCalledWith('123');
    });

    test('应该限制最大长度为6位', () => {
      const mockOnChange = vi.fn();
      render(<VerificationCodeInput value="" onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      
      // 尝试输入超过6位的数字
      fireEvent.change(input, { target: { value: '123456789' } });
      
      // 应该只保留前6位
      expect(mockOnChange).toHaveBeenCalledWith('123456');
    });

    test('应该显示当前输入的字符数', () => {
      render(<VerificationCodeInput value="123" onChange={() => {}} />);
      
      // 应该显示字符计数
      expect(screen.getByText('3/6')).toBeInTheDocument();
    });

    test('disabled状态下应该禁用输入', () => {
      render(<VerificationCodeInput value="" onChange={() => {}} disabled={true} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    test('应该正确处理value属性', () => {
      render(<VerificationCodeInput value="123456" onChange={() => {}} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('123456');
    });

    test('应该在输入变化时调用onChange', () => {
      const mockOnChange = vi.fn();
      render(<VerificationCodeInput value="" onChange={mockOnChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '123' } });
      
      expect(mockOnChange).toHaveBeenCalledWith('123');
    });
  });
});