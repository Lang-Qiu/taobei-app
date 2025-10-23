import React from 'react';

interface VerificationCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "请输入验证码"
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // 只允许输入数字
    newValue = newValue.replace(/\D/g, '');
    
    // 限制最大长度为6位
    if (newValue.length > 6) {
      newValue = newValue.slice(0, 6);
    }
    
    onChange(newValue);
  };

  return (
    <div style={{ flex: 1 }}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={6}
        style={{
          border: '1px solid #ddd',
          padding: '8px 12px',
          borderRadius: '4px',
          width: '100%',
          fontSize: '14px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
};

export default VerificationCodeInput;