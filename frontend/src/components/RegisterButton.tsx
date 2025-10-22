import React from 'react';

interface RegisterButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  text?: string;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  text = '注册'
}) => {
  const handleClick = () => {
    if (!disabled && !loading) {
      onClick();
    }
  };

  const getButtonText = () => {
    if (loading) {
      return '注册中...';
    }
    return text;
  };

  const getButtonClass = () => {
    let className = 'register-button';
    if (disabled || loading) {
      className += ' disabled';
    }
    if (loading) {
      className += ' loading';
    }
    return className;
  };

  return (
    <button
      type="button"
      className={getButtonClass()}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading && <span className="loading-spinner"></span>}
      {getButtonText()}
    </button>
  );
};

export default RegisterButton;