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
    <div className="agreement-checkbox">
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <span className="checkmark"></span>
        <span className="agreement-text">
          <span>我已阅读并同意</span>
          <button 
            type="button" 
            className="link-button"
            onClick={handleTermsClick}
          >
            《用户协议》
          </button>
          <span>和</span>
          <button 
            type="button" 
            className="link-button"
            onClick={handlePrivacyClick}
          >
            《隐私政策》
          </button>
        </span>
      </label>
    </div>
  );
};

export default AgreementCheckbox;