import React, { useState } from 'react';
import PhoneInput from './PhoneInput';
import VerificationCodeInput from './VerificationCodeInput';
import CountdownButton from './CountdownButton';
import AgreementCheckbox from './AgreementCheckbox';
import RegisterButton from './RegisterButton';
import BackToHomeButton from './BackToHomeButton';

interface RegisterPageProps {
  onRegisterSuccess?: (data: { userId: string; token: string }) => void;
  onNavigateToLogin?: () => void;
  onNavigateToHome?: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onNavigateToHome
}) => {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const getApiUrl = (endpoint: string) => {
    // 开发环境下明确指向后端服务器
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}${endpoint}`;
  };

  const handleSendCode = async () => {
    try {
      setError('');
      const response = await fetch(getApiUrl('/api/auth/send-verification-code'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '发送验证码失败');
      }

      // 验证码发送成功
      console.log('验证码发送成功');
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送验证码失败');
      throw err; // 重新抛出错误，让CountdownButton处理
    }
  };

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      setError('');

      // 密码验证
      if (password.length < 6) {
        throw new Error('密码长度至少6位');
      }
      if (password !== confirmPassword) {
        throw new Error('两次输入的密码不一致');
      }

      const response = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phone,
          verificationCode: verificationCode,
          password: password,
          agreeToTerms: agreeToTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // 用户已存在，自动登录
          if (onRegisterSuccess) {
            onRegisterSuccess({ userId: data.userId, token: data.token });
          }
          return;
        }
        throw new Error(data.error || '注册失败');
      }

      // 注册成功
      if (onRegisterSuccess) {
        onRegisterSuccess({ userId: data.userId, token: data.token });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
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

      {error && (
        <div style={{
          color: '#ff4d4f',
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          borderRadius: '4px',
          padding: '8px 12px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

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
              value={phone}
              onChange={setPhone}
              onValidationChange={setIsPhoneValid}
              placeholder="请输入你的手机号码"
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
            gap: '8px',
            flex: 1
          }}>
            <VerificationCodeInput
              value={verificationCode}
              onChange={setVerificationCode}
              placeholder="请输入验证码"
            />
            <CountdownButton
              onClick={handleSendCode}
              disabled={!isPhoneValid}
              countdown={0}
            />
          </div>
        </div>
      </div>

      {/* 设置密码 */}
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
            登录密码
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '8px 12px',
            flex: 1
          }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请设置登录密码"
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                fontSize: '14px',
                color: '#333'
              }}
            />
          </div>
        </div>
      </div>

      {/* 确认密码 */}
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
            确认密码
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '8px 12px',
            flex: 1
          }}>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请确认登录密码"
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                fontSize: '14px',
                color: '#333'
              }}
            />
          </div>
        </div>
      </div>

      <AgreementCheckbox
        checked={agreeToTerms}
        onChange={setAgreeToTerms}
      />

      <RegisterButton
        onClick={handleRegister}
        disabled={!isPhoneValid || !verificationCode || !password || !confirmPassword || !agreeToTerms}
        loading={isLoading}
      />

      {/* 登录链接 */}
      <div style={{
        textAlign: 'center',
        marginTop: '16px'
      }}>
        <span style={{ color: '#666', fontSize: '14px' }}>已有账号？</span>
        <button 
          onClick={onNavigateToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff9500',
            textDecoration: 'none',
            fontSize: '14px',
            cursor: 'pointer',
            marginLeft: '4px'
          }}
        >
          立即登录
        </button>
      </div>

      {/* 返回首页按钮 */}
      {onNavigateToHome && (
        <div style={{
          textAlign: 'center',
          marginTop: '16px'
        }}>
          <BackToHomeButton
            onNavigateToHome={onNavigateToHome}
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default RegisterPage;