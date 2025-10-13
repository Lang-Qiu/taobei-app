import React, { useState, useEffect } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange: (isValid: boolean) => void;
  disabled?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  onValidationChange,
  disabled = false
}) => {
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 手机号格式校验函数
  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return false;
    // 11位数字，1开头
    const phoneRegex = /^1\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // 只允许输入数字
    newValue = newValue.replace(/\D/g, '');
    
    // 限制最大长度为11位
    if (newValue.length > 11) {
      newValue = newValue.slice(0, 11);
    }
    
    onChange(newValue);
  };

  // 当value变化时进行校验
  useEffect(() => {
    const valid = validatePhoneNumber(value);
    setIsValid(valid);
    
    if (value && !valid) {
      setErrorMessage('请输入正确的手机号码');
    } else {
      setErrorMessage('');
    }
    
    onValidationChange(valid);
  }, [value, onValidationChange]);

  return (
    <div style={{ flex: 1 }}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="请输入你的手机号码"
        disabled={disabled}
        maxLength={11}
        style={{
          border: 'none',
          outline: 'none',
          padding: '0',
          fontSize: '14px',
          width: '100%',
          backgroundColor: 'transparent'
        }}
      />
      {errorMessage && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errorMessage}</div>}
    </div>
  );
};

export default PhoneInput;