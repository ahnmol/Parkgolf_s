import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/styles';

export const TournamentTitle = ({ title, onTitleChange }) => {
  return (
    <input
      type="text"
      value={title}
      onChange={(e) => onTitleChange(e.target.value)}
      placeholder="대회명을 입력하세요"
      style={{
        ...styles.input,
        fontSize: '1.2em',
        fontWeight: 'bold',
        width: '100%',
        maxWidth: '400px',
        padding: '8px',
        marginBottom: '10px'
      }}
    />
  );
};

TournamentTitle.propTypes = {
  title: PropTypes.string.isRequired,
  onTitleChange: PropTypes.func.isRequired
}; 