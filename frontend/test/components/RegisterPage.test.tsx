import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../../src/components/RegisterPage';

// Mock fetch
global.fetch = vi.fn();

// Mock子组件
vi.mock('../../src/components/PhoneInput', () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="phone-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}));

vi.mock('../../src/components/VerificationCodeInput', () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="verification-code-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}));

vi.mock('../../src/components/CountdownButton', () => ({
  default: ({ onClick, disabled }: any) => (
    <button
      data-testid="countdown-button"
      onClick={onClick}
      disabled={disabled}
    >
      获取验证码
    </button>
  )
}));

vi.mock('../../src/components/AgreementCheckbox', () => ({
  default: ({ checked, onChange }: any) => (
    <input
      data-testid="agreement-checkbox"
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  )
}));

vi.mock('../../src/components/RegisterButton', () => ({
  default: ({ onClick, disabled, loading }: any) => (
    <button
      data-testid="register-button"
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? '注册中...' : '注册'}
    </button>
  )
}));

describe('UI-RegisterPage', () => {
  const mockOnRegisterSuccess = vi.fn();
  const mockOnNavigateToLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    (global.fetch as any).mockClear();
  });

  describe('页面渲染和基本交互', () => {
    it('应该渲染完整的注册页面', () => {
      render(
        <RegisterPage
          onRegisterSuccess={mockOnRegisterSuccess}
          onNavigateToLogin={mockOnNavigateToLogin}
        />
      );

      expect(screen.getByText('用户注册')).toBeInTheDocument();
      expect(screen.getByTestId('phone-input')).toBeInTheDocument();
      expect(screen.getByTestId('verification-code-input')).toBeInTheDocument();
      expect(screen.getByTestId('countdown-button')).toBeInTheDocument();
      expect(screen.getByTestId('agreement-checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('register-button')).toBeInTheDocument();
      expect(screen.getByText('已有账号？')).toBeInTheDocument();
      expect(screen.getByText('立即登录')).toBeInTheDocument();
    });

    it('应该正确处理手机号输入', () => {
      render(<RegisterPage />);
      
      const phoneInput = screen.getByTestId('phone-input');
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });
      
      expect(phoneInput).toHaveValue('13800138000');
    });

    it('应该正确处理验证码输入', () => {
      render(<RegisterPage />);
      
      const codeInput = screen.getByTestId('verification-code-input');
      fireEvent.change(codeInput, { target: { value: '123456' } });
      
      expect(codeInput).toHaveValue('123456');
    });

    it('应该正确处理协议同意状态', () => {
      render(<RegisterPage />);
      
      const agreementCheckbox = screen.getByTestId('agreement-checkbox');
      fireEvent.click(agreementCheckbox);
      
      expect(agreementCheckbox).toBeChecked();
    });
  });

  describe('发送验证码功能', () => {
    it('当手机号为空时，获取验证码按钮应该被禁用', () => {
      render(<RegisterPage />);
      
      const countdownButton = screen.getByTestId('countdown-button');
      expect(countdownButton).toBeDisabled();
    });

    it('当手机号不为空时，获取验证码按钮应该可用', () => {
      render(<RegisterPage />);
      
      const phoneInput = screen.getByTestId('phone-input');
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });
      
      const countdownButton = screen.getByTestId('countdown-button');
      expect(countdownButton).not.toBeDisabled();
    });

    it('点击获取验证码按钮应该调用发送验证码逻辑', async () => {
      // Mock successful response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: '验证码发送成功' }),
      });

      render(<RegisterPage />);
      
      const phoneInput = screen.getByTestId('phone-input');
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });
      
      const countdownButton = screen.getByTestId('countdown-button');
      fireEvent.click(countdownButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/send-verification-code'),
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: '13800138000' }),
          })
        );
      });
    });
  });

  describe('注册按钮状态控制', () => {
    it('当必填字段未完整填写时，注册按钮应该被禁用', () => {
      render(<RegisterPage />);
      
      const registerButton = screen.getByTestId('register-button');
      expect(registerButton).toBeDisabled();
    });

    it('当手机号为空时，注册按钮应该被禁用', () => {
      render(<RegisterPage />);
      
      const codeInput = screen.getByTestId('verification-code-input');
      const agreementCheckbox = screen.getByTestId('agreement-checkbox');
      
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.click(agreementCheckbox);
      
      const registerButton = screen.getByTestId('register-button');
      expect(registerButton).toBeDisabled();
    });

    it('当验证码为空时，注册按钮应该被禁用', () => {
      render(<RegisterPage />);
      
      const phoneInput = screen.getByTestId('phone-input');
      const agreementCheckbox = screen.getByTestId('agreement-checkbox');
      
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });
      fireEvent.click(agreementCheckbox);
      
      const registerButton = screen.getByTestId('register-button');
      expect(registerButton).toBeDisabled();
    });

    it('当未同意协议时，注册按钮应该被禁用', () => {
      render(<RegisterPage />);
      
      const phoneInput = screen.getByTestId('phone-input');
      const codeInput = screen.getByTestId('verification-code-input');
      
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });
      fireEvent.change(codeInput, { target: { value: '123456' } });
      
      const registerButton = screen.getByTestId('register-button');
      expect(registerButton).toBeDisabled();
    });

    it('当所有必填字段都填写且同意协议时，注册按钮应该可用', () => {
      render(<RegisterPage />);
      
      const phoneInput = screen.getByTestId('phone-input');
      const codeInput = screen.getByTestId('verification-code-input');
      const agreementCheckbox = screen.getByTestId('agreement-checkbox');
      
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.click(agreementCheckbox);
      
      const registerButton = screen.getByTestId('register-button');
      expect(registerButton).not.toBeDisabled();
    });
  });

  describe('注册功能', () => {
    it('点击注册按钮应该调用注册逻辑', async () => {
      // Mock successful registration response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ 
          message: '注册成功', 
          userId: 'user123',
          token: 'token123'
        }),
      });

      render(<RegisterPage />);
      
      const phoneInput = screen.getByTestId('phone-input');
      const codeInput = screen.getByTestId('verification-code-input');
      const agreementCheckbox = screen.getByTestId('agreement-checkbox');
      
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.click(agreementCheckbox);
      
      const registerButton = screen.getByTestId('register-button');
      fireEvent.click(registerButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/register'),
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              phoneNumber: '13800138000',
              verificationCode: '123456',
              agreeToTerms: true
            }),
          })
        );
      });
    });

    it('注册成功后应该调用onRegisterSuccess回调', async () => {
      // Mock successful registration response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ 
          message: '注册成功', 
          userId: 'user123',
          token: 'token123'
        }),
      });

      render(
        <RegisterPage onRegisterSuccess={mockOnRegisterSuccess} />
      );
      
      const phoneInput = screen.getByTestId('phone-input');
      const codeInput = screen.getByTestId('verification-code-input');
      const agreementCheckbox = screen.getByTestId('agreement-checkbox');
      
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });
      fireEvent.change(codeInput, { target: { value: '123456' } });
      fireEvent.click(agreementCheckbox);
      
      const registerButton = screen.getByTestId('register-button');
      fireEvent.click(registerButton);
      
      await waitFor(() => {
        expect(mockOnRegisterSuccess).toHaveBeenCalledWith({
          userId: 'user123',
          token: 'token123'
        });
      });
    });
  });

  describe('导航功能', () => {
    it('点击"立即登录"应该调用onNavigateToLogin回调', () => {
      render(
        <RegisterPage onNavigateToLogin={mockOnNavigateToLogin} />
      );
      
      const loginLink = screen.getByText('立即登录');
      fireEvent.click(loginLink);
      
      expect(mockOnNavigateToLogin).toHaveBeenCalledTimes(1);
    });
  });
});