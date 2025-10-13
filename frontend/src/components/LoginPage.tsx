import React, { useState } from 'react';
import PhoneInput from './PhoneInput';
import VerificationCodeInput from './VerificationCodeInput';
import CountdownButton from './CountdownButton';
import LoginButton from './LoginButton';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const handlePhoneValidationChange = (isValid: boolean) => {
    setIsPhoneValid(isValid);
  };

  const handleRequestCode = async () => {
    if (!isPhoneValid) {
      setError('请输入正确的手机号');
      return;
    }

    try {
      setError('');
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '获取验证码失败');
      }

      setCountdown(60);
    } catch (error: any) {
      setError(error.message || '获取验证码失败');
    }
  };

  const handleLogin = async () => {
    if (!isPhoneValid) {
      setError('请输入正确的手机号');
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      setError('请输入6位验证码');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: phoneNumber, 
          code: verificationCode 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '登录失败');
      }

      // 保存token到localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      onLoginSuccess();
    } catch (error: any) {
      setError(error.message || '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          backgroundColor: '#ff9500',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontWeight: 'bold',
          marginRight: '12px'
        }}>
          淘宝
        </div>
        <span style={{
          fontSize: '18px',
          color: '#333'
        }}>
          用户注册
        </span>
      </div>

      {/* 手机号输入 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{
            color: '#666',
            marginRight: '12px',
            minWidth: '60px'
          }}>
            手机号
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '8px 12px',
            flex: 1
          }}>
            <select style={{
              border: 'none',
              outline: 'none',
              marginRight: '8px',
              color: '#666'
            }}>
              <option>中国大陆 +86</option>
            </select>
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              onValidationChange={handlePhoneValidationChange}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* 验证码输入 */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{
            color: '#666',
            marginRight: '12px',
            minWidth: '60px'
          }}>
            验证码
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            gap: '12px'
          }}>
            <VerificationCodeInput
              value={verificationCode}
              onChange={setVerificationCode}
              disabled={isLoading}
            />
            <CountdownButton
              onClick={handleRequestCode}
              disabled={!isPhoneValid || isLoading}
              countdown={countdown}
            />
          </div>
        </div>
      </div>

      {/* 错误信息 */}
      {error && (
        <div style={{ 
          color: '#ff4d4f', 
          fontSize: '14px',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* 登录按钮 */}
      <LoginButton
        onClick={handleLogin}
        disabled={!isPhoneValid || !verificationCode || isLoading}
        loading={isLoading}
      />

      {/* 协议文本 */}
      <div style={{
        textAlign: 'center',
        fontSize: '12px',
        color: '#999',
        marginTop: '16px',
        lineHeight: '1.5'
      }}>
        已阅读并同意以下协议《淘宝平台服务协议》、《隐私权政策》、《芝麻协议》，支付宝及其关联公司隐私政策
      </div>

      {/* 企业注册链接 */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <a 
          href="#" 
          style={{
            color: '#ff9500',
            textDecoration: 'none',
            fontSize: '14px'
          }}
          onClick={(e) => {
            e.preventDefault();
            onNavigateToRegister();
          }}
        >
          切换到企业账号注册
        </a>
      </div>
    </div>
  );
};

export default LoginPage;