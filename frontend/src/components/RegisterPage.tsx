import React, { useState } from 'react';
import PhoneInput from './PhoneInput';
import VerificationCodeInput from './VerificationCodeInput';
import CountdownButton from './CountdownButton';
import AgreementCheckbox from './AgreementCheckbox';
import RegisterButton from './RegisterButton';

interface RegisterPageProps {
  onRegisterSuccess?: (data: { userId: string; token: string }) => void;
  onNavigateToLogin?: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToLogin
}) => {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getApiUrl = (endpoint: string) => {
    // 在测试环境中使用完整URL，在生产环境中使用相对路径
    const baseUrl = typeof window !== 'undefined' && window.location ? 
      window.location.origin : 'http://localhost:3000';
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

      const response = await fetch(getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phone,
          verificationCode: verificationCode,
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
    <div className="register-page">
      <h1>用户注册</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <PhoneInput
        value={phone}
        onChange={setPhone}
        placeholder="请输入手机号"
      />
      
      <div className="verification-section">
        <VerificationCodeInput
          value={verificationCode}
          onChange={setVerificationCode}
          placeholder="请输入验证码"
        />
        <CountdownButton
          onClick={handleSendCode}
          disabled={!phone}
        />
      </div>
      
      <AgreementCheckbox
        checked={agreeToTerms}
        onChange={setAgreeToTerms}
      />
      
      <RegisterButton
        onClick={handleRegister}
        disabled={!phone || !verificationCode || !agreeToTerms}
        loading={isLoading}
      />
      
      <div className="login-link">
        已有账号？
        <button onClick={onNavigateToLogin}>立即登录</button>
      </div>
    </div>
  );
};

export default RegisterPage;