import React from 'react'

interface HomePageProps {
  onNavigateToLogin?: () => void
  onNavigateToRegister?: () => void
}

const HomePage: React.FC<HomePageProps> = ({
  onNavigateToLogin,
  onNavigateToRegister
}) => {
  const handleLoginClick = () => {
    onNavigateToLogin?.()
  }

  const handleRegisterClick = () => {
    onNavigateToRegister?.()
  }

  return (
    <div className="homepage" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>欢迎来到淘贝</h1>
        <p style={styles.subtitle}>您的购物新体验</p>
      </div>
      
      <div className="auth-buttons" style={styles.buttonContainer}>
        <button 
          className="login-button"
          data-testid="login-nav-button"
          onClick={handleLoginClick}
          style={styles.loginButton}
        >
          亲，请登录
        </button>
        
        <button 
          className="register-button"
          data-testid="register-nav-button"
          onClick={handleRegisterClick}
          style={styles.registerButton}
        >
          免费注册
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '40px'
  },
  title: {
    fontSize: '2.5rem',
    color: '#ff6b35',
    margin: '0 0 10px 0',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    margin: '0'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    width: '100%',
    maxWidth: '300px'
  },
  loginButton: {
    padding: '15px 30px',
    fontSize: '1.1rem',
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#e55a2b'
    }
  },
  registerButton: {
    padding: '15px 30px',
    fontSize: '1.1rem',
    backgroundColor: 'transparent',
    color: '#ff6b35',
    border: '2px solid #ff6b35',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#ff6b35',
      color: 'white'
    }
  }
}

export default HomePage