import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../../src/components/HomePage';

describe('HomePage Component', () => {
  describe('应用启动时默认展示', () => {
    it('应该在应用启动时默认显示首页', () => {
      render(<HomePage />);
      
      // 验证首页标题存在
      expect(screen.getByText('欢迎来到淘贝')).toBeInTheDocument();
      
      // 验证登录按钮存在
      expect(screen.getByTestId('login-nav-button')).toBeInTheDocument();
      expect(screen.getByText('亲，请登录')).toBeInTheDocument();
      
      // 验证注册按钮存在
      expect(screen.getByTestId('register-nav-button')).toBeInTheDocument();
      expect(screen.getByText('免费注册')).toBeInTheDocument();
    });
  });

  describe('导航功能', () => {
    it('应该在点击"亲，请登录"按钮时调用onNavigateToLogin回调', () => {
      const mockNavigateToLogin = vi.fn();
      render(<HomePage onNavigateToLogin={mockNavigateToLogin} />);
      
      const loginButton = screen.getByTestId('login-nav-button');
      fireEvent.click(loginButton);
      
      expect(mockNavigateToLogin).toHaveBeenCalledTimes(1);
    });

    it('应该在点击"免费注册"按钮时调用onNavigateToRegister回调', () => {
      const mockNavigateToRegister = vi.fn();
      render(<HomePage onNavigateToRegister={mockNavigateToRegister} />);
      
      const registerButton = screen.getByTestId('register-nav-button');
      fireEvent.click(registerButton);
      
      expect(mockNavigateToRegister).toHaveBeenCalledTimes(1);
    });

    it('应该在没有提供回调函数时不抛出错误', () => {
      render(<HomePage />);
      
      const loginButton = screen.getByTestId('login-nav-button');
      const registerButton = screen.getByTestId('register-nav-button');
      
      expect(() => {
        fireEvent.click(loginButton);
        fireEvent.click(registerButton);
      }).not.toThrow();
    });
  });

  describe('UI结构验证', () => {
    it('应该包含正确的CSS类名和数据测试ID', () => {
      render(<HomePage />);
      
      // 验证主容器
      expect(document.querySelector('.homepage')).toBeInTheDocument();
      
      // 验证按钮容器
      expect(document.querySelector('.auth-buttons')).toBeInTheDocument();
      
      // 验证按钮类名
      expect(document.querySelector('.login-button')).toBeInTheDocument();
      expect(document.querySelector('.register-button')).toBeInTheDocument();
    });
  });
});