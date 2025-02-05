import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/styles';

export const PasswordModal = ({ isOpen, onSubmit }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '1234') {  // 비밀번호를 'pkgolf'로 설정
      onSubmit();
    } else {
      setError('비밀번호가 올바르지 않습니다.');
      setPassword('');
    }
  };

  const modalStyle = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    content: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '300px',
      width: '90%',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '8px',
      marginTop: '10px',
      marginBottom: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      marginBottom: '10px',
    }
  };

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.content} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: '20px' }}>비밀번호 입력</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={modalStyle.input}
            placeholder="비밀번호를 입력하세요"
            autoFocus
          />
          {error && <div style={modalStyle.error}>{error}</div>}
          <button 
            type="submit"
            style={styles.button}
          >
            확인
          </button>
        </form>
      </div>
    </div>
  );
};

PasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
}; 