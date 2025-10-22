import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AgreementCheckbox from '../../src/components/AgreementCheckbox';

describe('UI-AgreementCheckbox', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染', () => {
    it('应该渲染复选框和协议文本', () => {
      render(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('我已阅读并同意')).toBeInTheDocument();
      expect(screen.getByText('《用户协议》')).toBeInTheDocument();
      expect(screen.getByText('和')).toBeInTheDocument();
      expect(screen.getByText('《隐私政策》')).toBeInTheDocument();
    });

    it('应该根据checked属性显示正确的选中状态', () => {
      const { rerender } = render(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      rerender(
        <AgreementCheckbox
          checked={true}
          onChange={mockOnChange}
        />
      );

      expect(checkbox).toBeChecked();
    });

    it('应该根据disabled属性控制禁用状态', () => {
      const { rerender } = render(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
          disabled={false}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeDisabled();

      rerender(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
          disabled={true}
        />
      );

      expect(checkbox).toBeDisabled();
    });
  });

  describe('交互功能', () => {
    it('点击复选框应该触发onChange回调', () => {
      render(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(true);
    });

    it('再次点击复选框应该切换状态', () => {
      render(
        <AgreementCheckbox
          checked={true}
          onChange={mockOnChange}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(false);
    });

    it('当disabled为true时，点击复选框不应该触发onChange', () => {
      render(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
          disabled={true}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('协议链接功能', () => {
    it('点击用户协议链接应该触发相应处理', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      render(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
        />
      );

      const termsLink = screen.getByText('《用户协议》');
      fireEvent.click(termsLink);

      expect(consoleSpy).toHaveBeenCalledWith('Show terms and conditions');
      
      consoleSpy.mockRestore();
    });

    it('点击隐私政策链接应该触发相应处理', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      render(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
        />
      );

      const privacyLink = screen.getByText('《隐私政策》');
      fireEvent.click(privacyLink);

      expect(consoleSpy).toHaveBeenCalledWith('Show privacy policy');
      
      consoleSpy.mockRestore();
    });

    it('协议链接应该是按钮类型，不会提交表单', () => {
      render(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
        />
      );

      const termsLink = screen.getByText('《用户协议》');
      const privacyLink = screen.getByText('《隐私政策》');

      expect(termsLink).toHaveAttribute('type', 'button');
      expect(privacyLink).toHaveAttribute('type', 'button');
    });
  });

  describe('可访问性', () => {
    it('应该有正确的标签结构', () => {
      render(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
        />
      );

      const label = screen.getByRole('checkbox').closest('label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveClass('checkbox-container');
    });

    it('应该包含checkmark元素用于自定义样式', () => {
      render(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
        />
      );

      const checkmark = document.querySelector('.checkmark');
      expect(checkmark).toBeInTheDocument();
    });

    it('应该包含协议文本容器', () => {
      render(
        <AgreementCheckbox
          checked={false}
          onChange={mockOnChange}
        />
      );

      const agreementText = document.querySelector('.agreement-text');
      expect(agreementText).toBeInTheDocument();
    });
  });
});