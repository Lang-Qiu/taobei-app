import React from 'react'

interface BackToHomeButtonProps {
  onNavigateToHome?: () => void
  disabled?: boolean
  className?: string
}

const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({
  onNavigateToHome,
  disabled = false,
  className = ''
}) => {
  const handleClick = () => {
    if (!disabled && onNavigateToHome) {
      onNavigateToHome()
    }
  }

  const buttonClasses = `back-to-home-button ${className}`.trim()

  return (
    <button 
      data-testid="back-to-home-button"
      onClick={handleClick}
      disabled={disabled}
      className={buttonClasses}
      style={{
        ...styles.button,
        ...(disabled ? styles.disabled : {}),
      }}
    >
      返回首页
    </button>
  )
}

const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '0.9rem',
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'normal',
    transition: 'all 0.3s ease',
    marginTop: '20px',
    ':hover': {
      backgroundColor: '#f5f5f5',
      borderColor: '#ccc'
    }
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.6,
    backgroundColor: '#f9f9f9',
    color: '#999'
  }
}

export default BackToHomeButton;