import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/styles';

export const TableHeader = ({ courseColumns, onSort, isPrintMode }) => {
  // 일차별 배경색 설정
  const getDayColor = (columnName) => {
    const dayMatch = columnName.match(/_(\d+)일차/);
    if (!dayMatch) return styles.th.backgroundColor;

    const dayNumber = parseInt(dayMatch[1]);
    const colors = [
      '#f1f1f1',  // 1일차: 기본 회색
      '#e3f2fd',  // 2일차: 연한 파랑
      '#f1f8e9',  // 3일차: 연한 초록
      '#fff3e0',  // 4일차: 연한 주황
      '#f3e5f5',  // 5일차: 연한 보라
      '#e0f7fa',  // 6일차: 연한 청록
      '#fce4ec',  // 7일차: 연한 분홍
    ];
    
    return colors[(dayNumber - 1) % colors.length];
  };

  return (
    <thead>
      <tr>
        {!isPrintMode && (
          <th className="action-column" style={{ ...styles.th, width: '24px' }}></th>
        )}
        <th style={{ ...styles.th, width: '40px' }} onClick={() => onSort('조')}>
          조
        </th>
        <th style={{ ...styles.th, width: '60px' }} onClick={() => onSort('시/도')}>
          시/도
        </th>
        <th style={{ ...styles.th, width: '60px' }} onClick={() => onSort('성명')}>
          성명
        </th>
        <th style={{ ...styles.th, width: '60px' }} onClick={() => onSort('시작코스')}>
          시작코스
        </th>
        {courseColumns.map((c, i) => (
          <th 
            key={i} 
            style={{ 
              ...styles.th, 
              backgroundColor: getDayColor(c),
              borderRight: c.match(/_\d+일차/) && 
                (i === courseColumns.length - 1 || !courseColumns[i + 1].includes(`_${c.match(/_(\d+)일차/)[1]}일차`))
                ? '2px solid #ddd' 
                : '1px solid #ddd'
            }} 
            onClick={() => onSort(c)}
          >
            {c.replace(/_(\d+)일차 합계$/, '_$1일차')}
          </th>
        ))}
        <th style={{ ...styles.th, backgroundColor: '#f8f9fa' }} onClick={() => onSort('총 합계')}>
          총 합계
        </th>
        <th style={{ ...styles.th, backgroundColor: '#f8f9fa' }} onClick={() => onSort('순위')}>
          순위
        </th>
      </tr>
    </thead>
  );
};

TableHeader.propTypes = {
  courseColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSort: PropTypes.func.isRequired,
  isPrintMode: PropTypes.bool
}; 