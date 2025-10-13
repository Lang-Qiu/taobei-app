import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../../src/components/LoginPage';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

import axios from 'axios';
const mockedAxios = vi.mocked(axios);

describe('LoginPage Component', () => {
  const mockOnLoginSuccess = vi.fn();
  const mockOnNavigateToRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('UI-LoginPage acceptanceCriteria', () => {
    test('应该渲染完整的登录界面', () => {
      render(
        <LoginPage
          onLoginSuccess={mockOnLoginSuccess}
          onNavigateToRegister={mockOnNavigateToRegister}
        />
      );

      // 检查所有必要的组件是否存在
      expect(screen.getByRole('textbox', { name: /手机号/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /验证码/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /获取验证码/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
      expect(screen.getByText(/还没有账号/)).toBeInTheDocument();
    });

    test('应该集成PhoneInput组件并处理手机号校验', async () => {
      render(
        <LoginPage
          onLoginSuccess={mockOnLoginSuccess}
          onNavigateToRegister={mockOnNavigateToRegister}
        />
      );

      const phoneInput = screen.getByRole('textbox', { name: /手机号/i });
      const getCodeButton = screen.getByRole('button', { name: /获取验证码/i });

      // 输入无效手机号
      fireEvent.change(phoneInput, { target: { value: '123' } });
      
      // 获取验证码按钮应该被禁用
      expect(getCodeButton).toBeDisabled();

      // 输入有效手机号
      fireEvent.change(phoneInput, { target: { value: '13812345678' } });
      
      // 获取验证码按钮应该可用
      await waitFor(() => {
        expect(getCodeButton).not.toBeDisabled();
      });
    });

    test('应该集成VerificationCodeInput组件', () => {
      render(
        <LoginPage
          onLoginSuccess={mockOnLoginSuccess}
          onNavigateToRegister={mockOnNavigateToRegister}
        />
      );

      const codeInput = screen.getByRole('textbox', { name: /验证码/i });
      
      // 输入验证码
      fireEvent.change(codeInput, { target: { value: '123456' } });
      
      expect(codeInput).toHaveValue('123456');
    });

    test('应该集成CountdownButton组件并处理获取验证码', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { message: '验证码已发送', expiresIn: 60 }
      });

      render(
        <LoginPage
          onLoginSuccess={mockOnLoginSuccess}
          onNavigateToRegister={mockOnNavigateToRegister}
        />
      );

      const phoneInput = screen.getByRole('textbox', { name: /手机号/i });
      const getCodeButton = screen.getByRole('button', { name: /获取验证码/i });

      // 输入有效手机号
      fireEvent.change(phoneInput, { target: { value: '13812345678' } });
      
      // 点击获取验证码
      fireEvent.click(getCodeButton);

      // 验证API调用
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/send-verification-code', {
          phoneNumber: '13812345678'
        });
      });
    });

    test('应该集成LoginButton组件并处理登录', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { message: '登录成功', token: 'fake-token', userId: '123' }
      });

      render(
        <LoginPage
          onLoginSuccess={mockOnLoginSuccess}
          onNavigateToRegister={mockOnNavigateToRegister}
        />
      );

      const phoneInput = screen.getByRole('textbox', { name: /手机号/i });
      const codeInput = screen.getByRole('textbox', { name: /验证码/i });
      const loginButton = screen.getByRole('button', { name: /登录/i });

      // 输入手机号和验证码
      fireEvent.change(phoneInput, { target: { value: '13812345678' } });
      fireEvent.change(codeInput, { target: { value: '123456' } });
      
      // 点击登录
      fireEvent.click(loginButton);

      // 验证API调用
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', {
          phoneNumber: '13812345678',
          verificationCode: '123456'
        });
      });

      // 验证登录成功回调
      await waitFor(() => {
        expect(mockOnLoginSuccess).toHaveBeenCalledWith({
          token: 'fake-token',
          userId: '123'
        });
      });
    });

    test('应该处理API错误并显示错误信息', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { error: '验证码错误' } }
      });

      render(
        <LoginPage
          onLoginSuccess={mockOnLoginSuccess}
          onNavigateToRegister={mockOnNavigateToRegister}
        />
      );

      const phoneInput = screen.getByRole('textbox', { name: /手机号/i });
      const codeInput = screen.getByRole('textbox', { name: /验证码/i });
      const loginButton = screen.getByRole('button', { name: /登录/i });

      // 输入手机号和验证码
      fireEvent.change(phoneInput, { target: { value: '13812345678' } });
      fireEvent.change(codeInput, { target: { value: '123456' } });
      
      // 点击登录
      fireEvent.click(loginButton);

      // 验证错误信息显示
      await waitFor(() => {
        expect(screen.getByText('验证码错误')).toBeInTheDocument();
      });
    });

    test('应该处理注册页面导航', () => {
      render(
        <LoginPage
          onLoginSuccess={mockOnLoginSuccess}
          onNavigateToRegister={mockOnNavigateToRegister}
        />
      );

      const registerLink = screen.getByText(/立即注册/);
      fireEvent.click(registerLink);

      expect(mockOnNavigateToRegister).toHaveBeenCalledTimes(1);
    });

    test('登录按钮应该在表单无效时被禁用', () => {
      render(
        <LoginPage
          onLoginSuccess={mockOnLoginSuccess}
          onNavigateToRegister={mockOnNavigateToRegister}
        />
      );

      const loginButton = screen.getByRole('button', { name: /登录/i });
      
      // 初始状态下登录按钮应该被禁用
      expect(loginButton).toBeDisabled();
    });

    test('登录按钮应该在表单有效时可用', async () => {
      render(
        <LoginPage
          onLoginSuccess={mockOnLoginSuccess}
          onNavigateToRegister={mockOnNavigateToRegister}
        />
      );

      const phoneInput = screen.getByRole('textbox', { name: /手机号/i });
      const codeInput = screen.getByRole('textbox', { name: /验证码/i });
      const loginButton = screen.getByRole('button', { name: /登录/i });

      // 输入有效的手机号和验证码
      fireEvent.change(phoneInput, { target: { value: '13812345678' } });
      fireEvent.change(codeInput, { target: { value: '123456' } });

      // 登录按钮应该可用
      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      });
    });
  });
});