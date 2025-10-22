import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterButton from '../../src/components/RegisterButton';

describe('UI-RegisterButton', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本渲染', () => {
    it('应该渲染默认的注册按钮', () => {
      render(
        <RegisterButton onClick={mockOnClick} />
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('注册');
      expect(button).toHaveClass('register-button');
    });

    it('应该支持自定义按钮文本', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          text="立即注册"
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('立即注册');
    });

    it('应该有正确的按钮类型', () => {
      render(
        <RegisterButton onClick={mockOnClick} />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('禁用状态', () => {
    it('当disabled为true时，按钮应该被禁用', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          disabled={true}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('register-button disabled');
    });

    it('当disabled为false时，按钮应该可用', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          disabled={false}
        />
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveClass('disabled');
    });

    it('默认情况下按钮应该可用', () => {
      render(
        <RegisterButton onClick={mockOnClick} />
      );

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('加载状态', () => {
    it('当loading为true时，应该显示加载状态', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          loading={true}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('注册中...');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('register-button disabled loading');
    });

    it('当loading为true时，应该显示加载图标', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          loading={true}
        />
      );

      const spinner = document.querySelector('.loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('当loading为false时，不应该显示加载状态', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          loading={false}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('注册');
      expect(button).not.toHaveClass('loading');
      
      const spinner = document.querySelector('.loading-spinner');
      expect(spinner).not.toBeInTheDocument();
    });

    it('默认情况下不应该显示加载状态', () => {
      render(
        <RegisterButton onClick={mockOnClick} />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('注册');
      expect(button).not.toHaveClass('loading');
    });
  });

  describe('点击交互', () => {
    it('点击可用按钮应该触发onClick回调', () => {
      render(
        <RegisterButton onClick={mockOnClick} />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('点击禁用按钮不应该触发onClick回调', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          disabled={true}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('点击加载中的按钮不应该触发onClick回调', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          loading={true}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('当既disabled又loading时，点击不应该触发onClick回调', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          disabled={true}
          loading={true}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('样式类名', () => {
    it('基础状态应该只有register-button类', () => {
      render(
        <RegisterButton onClick={mockOnClick} />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('register-button');
      expect(button).not.toHaveClass('disabled');
      expect(button).not.toHaveClass('loading');
    });

    it('禁用状态应该添加disabled类', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          disabled={true}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('register-button disabled');
    });

    it('加载状态应该添加disabled和loading类', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          loading={true}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('register-button disabled loading');
    });

    it('同时disabled和loading应该有所有相关类', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          disabled={true}
          loading={true}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('register-button disabled loading');
    });
  });

  describe('文本显示逻辑', () => {
    it('正常状态显示默认文本', () => {
      render(
        <RegisterButton onClick={mockOnClick} />
      );

      expect(screen.getByText('注册')).toBeInTheDocument();
    });

    it('正常状态显示自定义文本', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          text="立即注册"
        />
      );

      expect(screen.getByText('立即注册')).toBeInTheDocument();
    });

    it('加载状态始终显示"注册中..."', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          text="立即注册"
          loading={true}
        />
      );

      expect(screen.getByText('注册中...')).toBeInTheDocument();
      expect(screen.queryByText('立即注册')).not.toBeInTheDocument();
    });

    it('禁用但非加载状态显示原文本', () => {
      render(
        <RegisterButton
          onClick={mockOnClick}
          text="立即注册"
          disabled={true}
          loading={false}
        />
      );

      expect(screen.getByText('立即注册')).toBeInTheDocument();
    });
  });
});