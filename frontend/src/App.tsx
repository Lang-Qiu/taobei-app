import React from 'react'
import LoginPage from './components/LoginPage'

function App() {
  const handleLoginSuccess = () => {
    // TODO: 实现登录成功后的页面跳转逻辑
    console.log('登录成功，跳转到首页');
  };

  const handleNavigateToRegister = () => {
    // TODO: 实现导航到注册页面的逻辑
    console.log('导航到注册页面');
  };

  return (
    <div>
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={handleNavigateToRegister}
      />
    </div>
  )
}

export default App