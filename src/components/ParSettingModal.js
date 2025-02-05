import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/styles';

export const ParSettingModal = ({ isOpen, onClose, onSubmit, courseColumns, parData }) => {
  if (!isOpen) return null;

  const [selectedCourse, setSelectedCourse] = useState('');
  const [pars, setPars] = useState(Array(9).fill(''));

  const uniqueCourses = [...new Set(courseColumns.map(col => col.split('_')[0]))];

  const handleSubmit = () => {
    onSubmit(selectedCourse, pars);
    onClose();
  };

  const handleParChange = (index, value) => {
    const newPars = [...pars];
    newPars[index] = value;
    setPars(newPars);
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
      maxWidth: '500px',
      width: '90%',
      position: 'relative',
    },
  };

  return (
    <div style={modalStyle.overlay} onClick={onClose}>
      <div style={modalStyle.content} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>코스별 파 설정</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label>코스 선택: </label>
          <select 
            value={selectedCourse} 
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setPars(parData[e.target.value]?.pars || Array(9).fill(''));
            }}
            style={{ padding: '5px', marginLeft: '10px' }}
          >
            <option value="">코스를 선택하세요</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <div style={{ marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {[...Array(9)].map((_, i) => (
                    <th key={i} style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {i + 1}홀
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[...Array(9)].map((_, i) => (
                    <td key={i} style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        maxLength="1"
                        value={pars[i]}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (value >= '1' && value <= '9')) {
                            handleParChange(i, value);
                          }
                        }}
                        style={{ 
                          width: '20px', 
                          padding: '4px',
                          textAlign: 'center',
                          border: '1px solid #ddd',
                          appearance: 'textfield',
                          '-webkit-appearance': 'none',
                          '-moz-appearance': 'textfield',
                          fontSize: '14px'
                        }}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            onClick={onClose}
            style={{ ...styles.button, backgroundColor: '#ff3b30' }}
          >
            취소
          </button>
          <button 
            onClick={handleSubmit}
            style={styles.button}
            disabled={!selectedCourse}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

ParSettingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  courseColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  parData: PropTypes.object.isRequired,
}; 