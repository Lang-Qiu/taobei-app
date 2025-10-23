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
  text = '同意并注册'
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

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      style={{
        width: '100%',
        padding: '12px 20px',
        backgroundColor: disabled || loading ? '#ffccc7' : '#ff9500',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        marginTop: '20px',
        marginBottom: '16px',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}
    >
      {loading && (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid #ffffff',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {getButtonText()}
    </button>
  );
};

export default RegisterButton;