import React, { useState } from 'react'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'

type CurrentPage = 'home' | 'login' | 'register'

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home')

  const handleLoginSuccess = () => {
    // TODO: 实现登录成功后的页面跳转逻辑
    console.log('登录成功，跳转到首页');
    setCurrentPage('home')
  };

  const handleRegisterSuccess = () => {
    // TODO: 实现注册成功后的页面跳转逻辑
    console.log('注册成功，跳转到首页');
    setCurrentPage('home')
  };

  const handleNavigateToLogin = () => {
    console.log('导航到登录页面');
    setCurrentPage('login')
  };

  const handleNavigateToRegister = () => {
    console.log('导航到注册页面');
    setCurrentPage('register')
  };

  const handleNavigateToHome = () => {
    console.log('导航到首页');
    setCurrentPage('home')
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToRegister={handleNavigateToRegister}
          />
        )
      case 'login':
        return (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={handleNavigateToRegister}
            onNavigateToHome={handleNavigateToHome}
          />
        )
      case 'register':
        return (
          <RegisterPage
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToHome={handleNavigateToHome}
          />
        )
      default:
        return null
    }
  }

  return (
    <div>
      {renderCurrentPage()}
    </div>
  )
}

export default App