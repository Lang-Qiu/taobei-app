import React from 'react';

interface LoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  onClick,
  disabled = false,
  loading = false
}) => {
  const getButtonText = () => {
    if (loading) {
      return '登录中...';
    }
    return '同意并注册';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: '100%',
        backgroundColor: disabled || loading ? '#ccc' : '#ff9500',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        marginTop: '16px'
      }}
    >
      {loading && <span style={{ marginRight: '8px' }}>⏳</span>}
      {getButtonText()}
    </button>
  );
};

export default LoginButton;