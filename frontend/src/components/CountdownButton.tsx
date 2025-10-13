import React, { useState, useEffect } from 'react';

interface CountdownButtonProps {
  onClick: () => void;
  disabled?: boolean;
  countdown: number;
}

const CountdownButton: React.FC<CountdownButtonProps> = ({
  onClick,
  disabled = false,
  countdown
}) => {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      setIsCountingDown(true);
      setRemainingTime(countdown);
    }
  }, [countdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isCountingDown && remainingTime > 0) {
      timer = setTimeout(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsCountingDown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isCountingDown, remainingTime]);

  const handleClick = () => {
    if (!isCountingDown && !disabled) {
      setIsCountingDown(true);
      setRemainingTime(60);
      onClick();
    }
  };

  const getButtonText = () => {
    if (isCountingDown && remainingTime > 0) {
      return `重新发送(${remainingTime})`;
    }
    return '获取验证码';
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isCountingDown}
      style={{
        backgroundColor: 'transparent',
        color: disabled || isCountingDown ? '#ccc' : '#ff9500',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: disabled || isCountingDown ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        minWidth: '80px'
      }}
    >
      {isCountingDown ? `${timeLeft}s` : '获取验证码'}
    </button>
  );
};

export default CountdownButton;