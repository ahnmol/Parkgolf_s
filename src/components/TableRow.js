import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/styles';
import { getRank } from '../utils/calculations';

export const TableRow = ({ 
  row, 
  rowIndex, 
  courseColumns, 
  onOpenScoreModal, 
  onDeleteRow, 
  onUpdateField,
  allRows,
  isPrintMode
}) => {
  const inputStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'center',
    width: '100%',
    padding: '4px 0',
    outline: 'none',
    minHeight: '20px',
    lineHeight: '20px',
    fontSize: '16px',
    fontWeight: 'bold'
  };

  const tdStyle = {
    ...styles.td,
    height: '32px',
    verticalAlign: 'middle',
    textAlign: 'center',
    padding: '0'
  };

  // 각 코스의 합계 계산
  const calculateCourseTotal = (courseScores) => {
    return courseScores.reduce((sum, score) => sum + (score || 0), 0);
  };

  return (
    <tr>
      {!isPrintMode && (
        <td className="action-column" style={{ ...tdStyle, width: '70px', padding: '2px 4px' }}>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
            <button
              style={{ 
                ...styles.button, 
                padding: '3px', 
                width: '30px', 
                height: '24px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => onOpenScoreModal(rowIndex)}
            >
              ✏️
            </button>
            <button
              style={{ 
                ...styles.button, 
                padding: '3px', 
                width: '30px', 
                height: '24px',
                backgroundColor: '#ff3b30', 
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => onDeleteRow(rowIndex)}
            >
              🗑️
            </button>
          </div>
        </td>
      )}
      <td style={tdStyle}>
        <input
          type="text"
          value={row.group}
          onChange={(e) => onUpdateField(rowIndex, 'group', e.target.value)}
          style={{ ...inputStyle }}
          readOnly={isPrintMode}
        />
      </td>
      <td style={tdStyle}>
        <input
          type="text"
          value={row.region}
          onChange={(e) => onUpdateField(rowIndex, 'region', e.target.value)}
          style={{ ...inputStyle }}
          readOnly={isPrintMode}
        />
      </td>
      <td style={tdStyle}>
        <input
          type="text"
          value={row.name}
          onChange={(e) => onUpdateField(rowIndex, 'name', e.target.value)}
          style={{ ...inputStyle }}
          readOnly={isPrintMode}
        />
      </td>
      <td style={tdStyle}>
        <input
          type="text"
          value={row.startCourse}
          onChange={(e) => onUpdateField(rowIndex, 'startCourse', e.target.value)}
          style={{ ...inputStyle }}
          readOnly={isPrintMode}
        />
      </td>
      {courseColumns.map((courseKey, idx) => (
        <td key={idx} style={tdStyle}>
          <div style={{ width: '100%', textAlign: 'center' }}>
            {calculateCourseTotal(row.courses[courseKey] || [])}
          </div>
        </td>
      ))}
      <td style={tdStyle}>
        <div style={{ width: '100%', textAlign: 'center' }}>
          {row.total}
        </div>
      </td>
      <td style={{
        ...tdStyle,
        color: 'red',
        fontWeight: 'bold'
      }}>
        <div style={{ width: '100%', textAlign: 'center' }}>
          {getRank(row, allRows)}
        </div>
      </td>
    </tr>
  );
};

TableRow.propTypes = {
  row: PropTypes.shape({
    group: PropTypes.string,
    name: PropTypes.string,
    region: PropTypes.string,
    startCourse: PropTypes.string,
    courses: PropTypes.object,
    total: PropTypes.number
  }).isRequired,
  rowIndex: PropTypes.number.isRequired,
  courseColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  onOpenScoreModal: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
  onUpdateField: PropTypes.func.isRequired,
  allRows: PropTypes.array.isRequired,
  isPrintMode: PropTypes.bool
}; 