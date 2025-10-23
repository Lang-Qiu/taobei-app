import React from 'react';

interface AgreementCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const AgreementCheckbox: React.FC<AgreementCheckboxProps> = ({
  checked,
  onChange,
  disabled = false
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  const handleTermsClick = () => {
    // TODO: 实现用户协议查看逻辑
    // 打开用户协议弹窗或跳转到协议页面
    console.log('Show terms and conditions');
  };

  const handlePrivacyClick = () => {
    // TODO: 实现隐私政策查看逻辑
    // 打开隐私政策弹窗或跳转到隐私政策页面
    console.log('Show privacy policy');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      marginTop: '16px',
      marginBottom: '8px'
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        style={{
          marginRight: '8px',
          marginTop: '2px',
          accentColor: '#ff9500'
        }}
      />
      <span style={{
        fontSize: '12px',
        color: '#666',
        lineHeight: '1.4'
      }}>
        我已阅读并同意
        <button 
          type="button" 
          onClick={handleTermsClick}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff9500',
            textDecoration: 'none',
            fontSize: '12px',
            cursor: 'pointer',
            padding: '0',
            margin: '0 2px'
          }}
        >
          《淘宝平台服务协议》
        </button>
        、
        <button 
          type="button" 
          onClick={handlePrivacyClick}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff9500',
            textDecoration: 'none',
            fontSize: '12px',
            cursor: 'pointer',
            padding: '0',
            margin: '0 2px'
          }}
        >
          《隐私权政策》
        </button>
        、《芝麻协议》，支付宝及其关联公司隐私政策
      </span>
    </div>
  );
};

export default AgreementCheckbox;