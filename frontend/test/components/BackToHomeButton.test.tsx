import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BackToHomeButton from '../../src/components/BackToHomeButton';

describe('BackToHomeButton Component', () => {
  describe('基本功能', () => {
    it('应该渲染返回首页按钮', () => {
      render(<BackToHomeButton />);
      
      const button = screen.getByTestId('back-to-home-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('返回首页');
    });

    it('应该在点击时调用onNavigateToHome回调', () => {
      const mockNavigateToHome = vi.fn();
      render(<BackToHomeButton onNavigateToHome={mockNavigateToHome} />);
      
      const button = screen.getByTestId('back-to-home-button');
      fireEvent.click(button);
      
      expect(mockNavigateToHome).toHaveBeenCalledTimes(1);
    });

    it('应该在没有提供回调函数时不抛出错误', () => {
      render(<BackToHomeButton />);
      
      const button = screen.getByTestId('back-to-home-button');
      
      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();
    });
  });

  describe('禁用状态', () => {
    it('应该支持禁用状态', () => {
      render(<BackToHomeButton disabled={true} />);
      
      const button = screen.getByTestId('back-to-home-button');
      expect(button).toBeDisabled();
    });

    it('应该在禁用状态下不调用回调函数', () => {
      const mockNavigateToHome = vi.fn();
      render(<BackToHomeButton onNavigateToHome={mockNavigateToHome} disabled={true} />);
      
      const button = screen.getByTestId('back-to-home-button');
      fireEvent.click(button);
      
      expect(mockNavigateToHome).not.toHaveBeenCalled();
    });

    it('应该在启用状态下正常工作', () => {
      const mockNavigateToHome = vi.fn();
      render(<BackToHomeButton onNavigateToHome={mockNavigateToHome} disabled={false} />);
      
      const button = screen.getByTestId('back-to-home-button');
      expect(button).not.toBeDisabled();
      
      fireEvent.click(button);
      expect(mockNavigateToHome).toHaveBeenCalledTimes(1);
    });
  });

  describe('样式和类名', () => {
    it('应该应用默认CSS类名', () => {
      render(<BackToHomeButton />);
      
      const button = screen.getByTestId('back-to-home-button');
      expect(button).toHaveClass('back-to-home-button');
    });

    it('应该支持自定义CSS类名', () => {
      const customClass = 'custom-button-style';
      render(<BackToHomeButton className={customClass} />);
      
      const button = screen.getByTestId('back-to-home-button');
      expect(button).toHaveClass('back-to-home-button');
      expect(button).toHaveClass(customClass);
    });
  });

  describe('可复用性验证', () => {
    it('应该能在登录页面中使用', () => {
      const mockNavigateToHome = vi.fn();
      const { container } = render(
        <div className="login-page">
          <BackToHomeButton onNavigateToHome={mockNavigateToHome} />
        </div>
      );
      
      expect(container.querySelector('.login-page .back-to-home-button')).toBeInTheDocument();
    });

    it('应该能在注册页面中使用', () => {
      const mockNavigateToHome = vi.fn();
      const { container } = render(
        <div className="register-page">
          <BackToHomeButton onNavigateToHome={mockNavigateToHome} />
        </div>
      );
      
      expect(container.querySelector('.register-page .back-to-home-button')).toBeInTheDocument();
    });
  });
});