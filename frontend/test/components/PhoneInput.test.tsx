import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import PhoneInput from '../../src/components/PhoneInput';

describe('PhoneInput Component', () => {
  describe('UI-PhoneInput acceptanceCriteria', () => {
    test('应该渲染手机号输入框', () => {
      render(<PhoneInput value="" onChange={() => {}} onValidationChange={() => {}} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', '请输入手机号');
    });

    test('应该只允许输入数字', () => {
      const mockOnChange = vi.fn();
      render(<PhoneInput value="" onChange={mockOnChange} onValidationChange={() => {}} />);
      
      const input = screen.getByRole('textbox');
      
      // 尝试输入字母
      fireEvent.change(input, { target: { value: 'abc123' } });
      
      // 应该只保留数字
      expect(mockOnChange).toHaveBeenCalledWith('123');
    });

    test('应该限制最大长度为11位', () => {
      const mockOnChange = vi.fn();
      render(<PhoneInput value="" onChange={mockOnChange} onValidationChange={() => {}} />);
      
      const input = screen.getByRole('textbox');
      
      // 尝试输入超过11位的数字
      fireEvent.change(input, { target: { value: '123456789012345' } });
      
      // 应该只保留前11位
      expect(mockOnChange).toHaveBeenCalledWith('12345678901');
    });

    test('应该验证手机号格式（11位数字，1开头）', () => {
      const mockOnValidationChange = vi.fn();
      render(<PhoneInput value="" onChange={() => {}} onValidationChange={mockOnValidationChange} />);
      
      const input = screen.getByRole('textbox');
      
      // 测试无效格式
      fireEvent.change(input, { target: { value: '123456789' } });
      expect(mockOnValidationChange).toHaveBeenCalledWith(false);
      
      // 测试不以1开头
      fireEvent.change(input, { target: { value: '22345678901' } });
      expect(mockOnValidationChange).toHaveBeenCalledWith(false);
      
      // 测试有效格式
      fireEvent.change(input, { target: { value: '13812345678' } });
      expect(mockOnValidationChange).toHaveBeenCalledWith(true);
    });

    test('应该显示错误提示信息', () => {
      render(<PhoneInput value="123" onChange={() => {}} onValidationChange={() => {}} />);
      
      // 应该显示错误提示
      expect(screen.getByText('请输入正确的手机号码')).toBeInTheDocument();
    });

    test('有效手机号时不应该显示错误提示', () => {
      render(<PhoneInput value="13812345678" onChange={() => {}} onValidationChange={() => {}} />);
      
      // 不应该显示错误提示
      expect(screen.queryByText('请输入正确的手机号码')).not.toBeInTheDocument();
    });

    test('disabled状态下应该禁用输入', () => {
      render(<PhoneInput value="" onChange={() => {}} onValidationChange={() => {}} disabled={true} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });
});