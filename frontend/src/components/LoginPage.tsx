import React, { useState } from 'react';
import PhoneInput from './PhoneInput';
import VerificationCodeInput from './VerificationCodeInput';
import CountdownButton from './CountdownButton';
import LoginButton from './LoginButton';
import BackToHomeButton from './BackToHomeButton';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
  onNavigateToHome?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToHome
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [loginType, setLoginType] = useState<'password' | 'sms'>('password');
  const [password, setPassword] = useState('');

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
      const response = await fetch('http://localhost:3000/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || '获取验证码失败');
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

    if (loginType === 'sms') {
      if (!verificationCode || verificationCode.length !== 6) {
        setError('请输入6位验证码');
        return;
      }
    } else {
      if (!password) {
        setError('请输入密码');
        return;
      }
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: phoneNumber, 
          code: loginType === 'sms' ? verificationCode : undefined,
          password: loginType === 'password' ? password : undefined
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || '登录失败');
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
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 左侧二维码扫码登录区域 */}
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        borderRight: '1px solid #e8e8e8'
      }}>
        <h2 style={{
          fontSize: '18px',
          color: '#333',
          marginBottom: '30px',
          fontWeight: 'normal'
        }}>
          手机扫码登录
        </h2>
        
        {/* 二维码占位符 */}
        <div style={{
          width: '200px',
          height: '200px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
            {/* 简单的二维码图案 */}
            <rect width="160" height="160" fill="white"/>
            <rect x="10" y="10" width="20" height="20" fill="black"/>
            <rect x="40" y="10" width="20" height="20" fill="black"/>
            <rect x="70" y="10" width="20" height="20" fill="black"/>
            <rect x="100" y="10" width="20" height="20" fill="black"/>
            <rect x="130" y="10" width="20" height="20" fill="black"/>
            <rect x="10" y="40" width="20" height="20" fill="black"/>
            <rect x="70" y="40" width="20" height="20" fill="black"/>
            <rect x="130" y="40" width="20" height="20" fill="black"/>
            <rect x="10" y="70" width="20" height="20" fill="black"/>
            <rect x="40" y="70" width="20" height="20" fill="black"/>
            <rect x="100" y="70" width="20" height="20" fill="black"/>
            <rect x="130" y="70" width="20" height="20" fill="black"/>
            <rect x="10" y="100" width="20" height="20" fill="black"/>
            <rect x="70" y="100" width="20" height="20" fill="black"/>
            <rect x="130" y="100" width="20" height="20" fill="black"/>
            <rect x="10" y="130" width="20" height="20" fill="black"/>
            <rect x="40" y="130" width="20" height="20" fill="black"/>
            <rect x="70" y="130" width="20" height="20" fill="black"/>
            <rect x="100" y="130" width="20" height="20" fill="black"/>
            <rect x="130" y="130" width="20" height="20" fill="black"/>
          </svg>
        </div>
        
        <p style={{
          fontSize: '14px',
          color: '#666',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          打开手机淘宝，扫一扫登录
        </p>
      </div>

      {/* 右侧登录表单区域 */}
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '350px',
          margin: '0 auto',
          width: '100%'
        }}>
          {/* 登录方式切换标签 */}
          <div style={{
            display: 'flex',
            marginBottom: '30px',
            borderBottom: '1px solid #e8e8e8'
          }}>
            <button
              onClick={() => setLoginType('password')}
              style={{
                padding: '12px 20px',
                border: 'none',
                backgroundColor: 'transparent',
                color: loginType === 'password' ? '#ff6600' : '#666',
                fontSize: '16px',
                cursor: 'pointer',
                borderBottom: loginType === 'password' ? '2px solid #ff6600' : 'none',
                marginRight: '20px'
              }}
            >
              密码登录
            </button>
            <button
              onClick={() => setLoginType('sms')}
              style={{
                padding: '12px 20px',
                border: 'none',
                backgroundColor: 'transparent',
                color: loginType === 'sms' ? '#ff6600' : '#666',
                fontSize: '16px',
                cursor: 'pointer',
                borderBottom: loginType === 'sms' ? '2px solid #ff6600' : 'none'
              }}
            >
              短信登录
            </button>
          </div>

          {/* 账号输入框 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}>
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                onValidationChange={handlePhoneValidationChange}
                placeholder="请输入手机号"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* 密码或验证码输入 */}
          {loginType === 'password' ? (
            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <a
                href="#"
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#ff6600',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
                onClick={(e) => e.preventDefault()}
              >
                忘记密码
              </a>
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <VerificationCodeInput
                  value={verificationCode}
                  onChange={setVerificationCode}
                  disabled={isLoading}
                  placeholder="验证码"
                />
                <CountdownButton
                  onClick={handleRequestCode}
                  disabled={!isPhoneValid || isLoading}
                  countdown={countdown}
                />
              </div>
            </div>
          )}

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
            disabled={!phoneNumber || !isPhoneValid || (loginType === 'password' ? !password : !verificationCode) || isLoading}
            loading={isLoading}
          />

          {/* 协议文本 */}
          <div style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#999',
            marginTop: '20px',
            lineHeight: '1.5'
          }}>
            登录即表示您同意淘宝
            <a href="#" style={{ color: '#ff6600', textDecoration: 'none' }}>《服务协议》</a>
            和
            <a href="#" style={{ color: '#ff6600', textDecoration: 'none' }}>《隐私政策》</a>
          </div>

          {/* 注册链接 */}
          <div style={{
            textAlign: 'center',
            marginTop: '30px'
          }}>
            <span style={{ color: '#666', fontSize: '14px' }}>还没有账号？</span>
            <a 
              href="#" 
              style={{
                color: '#ff6600',
                textDecoration: 'none',
                fontSize: '14px',
                marginLeft: '8px'
              }}
              onClick={(e) => {
                e.preventDefault();
                onNavigateToRegister();
              }}
            >
              立即注册
            </a>
          </div>

          {/* 返回首页按钮 */}
          {onNavigateToHome && (
            <div style={{
              textAlign: 'center',
              marginTop: '20px'
            }}>
              <BackToHomeButton
                onNavigateToHome={onNavigateToHome}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;