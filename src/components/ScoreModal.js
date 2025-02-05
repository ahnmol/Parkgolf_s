import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/styles';

export const ScoreModal = ({ modalData, onSubmit, onClose, onScoreChange, onDayChange }) => {
  const calculateCourseTotal = (scores) => {
    return scores.reduce((sum, score) => sum + (parseInt(score) || 0), 0);
  };

  const inputStyle = {
    ...styles.input,
    width: '40px',
    height: '32px',
    textAlign: 'center'
  };

  const holeNumberStyle = {
    width: '30px',
    textAlign: 'center',
    fontSize: '11px',
    color: '#666',
    marginBottom: '2px'
  };

  const courseContainerStyle = {
    marginBottom: '15px'
  };

  const scoreRowStyle = {
    display: 'flex',
    gap: '3px',
    flexWrap: 'wrap'
  };

  return (
    <div style={styles.modal.overlay}>
      <div style={styles.modal.content}>
        <h3 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '16px' }}>
          9홀 점수 입력
        </h3>
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <select 
            value={modalData.selectedDay || 1} 
            onChange={(e) => onDayChange(parseInt(e.target.value))}
            style={{
              padding: '6px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginBottom: '8px',
              width: '120px',
              fontSize: '13px'
            }}
          >
            {Array.from({ length: modalData.totalDays || 1 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}일차</option>
            ))}
          </select>
        </div>
        <div style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '20px' }}>
          {Object.entries(modalData.scores).map(([courseKey, scores]) => (
            <div key={courseKey} style={courseContainerStyle}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                {courseKey.replace(/_\d+일차 합계$/, '')} (합계: {calculateCourseTotal(scores)})
              </div>
              <div style={scoreRowStyle}>
                {scores.map((_, idx) => (
                  <div key={`hole-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={holeNumberStyle}>{idx + 1}홀</div>
                    <input
                      type="text"
                      value={scores[idx]}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 빈 값이거나 숫자만 허용
                        if (value === '' || /^\d{1,2}$/.test(value)) {
                          // 99 이하의 숫자만 허용
                          if (value === '' || parseInt(value) <= 99) {
                            onScoreChange(courseKey, idx, value);
                          }
                        }
                      }}
                      style={inputStyle}
                      maxLength={2}
                      pattern="\d*"
                      inputMode="numeric"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>
            총 합계: {
              Object.values(modalData.scores)
                .reduce((total, scores) => total + calculateCourseTotal(scores), 0)
            }
          </div>
          <button style={styles.button} onClick={onSubmit}>
            ✅ 제출
          </button>
          <button
            style={{ ...styles.button, backgroundColor: '#aaa', marginLeft: '10px' }}
            onClick={onClose}
          >
            ❌ 취소
          </button>
        </div>
      </div>
    </div>
  );
};

ScoreModal.propTypes = {
  modalData: PropTypes.shape({
    rowIndex: PropTypes.number.isRequired,
    scores: PropTypes.object.isRequired,
    selectedDay: PropTypes.number.isRequired,
    totalDays: PropTypes.number.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  onDayChange: PropTypes.func.isRequired
}; 