import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/styles';

export const Sidebar = ({ 
  onAddCourse, 
  onDeleteCourse, 
  onAddRow, 
  onAddDay, 
  onDeleteDay, 
  onFileLoad, 
  onSaveFile, 
  onCaptureTable,
  onCaptureGroupSheet,
  onPrintBusinessCards,
  onOpenParModal,
  isOpen,
  onToggle
}) => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const sidebarStyle = {
    ...styles.sidebar,
    transform: `translateX(${isOpen ? '0' : '-150px'})`,
    transition: 'transform 0.3s ease-in-out'
  };

  const toggleButtonStyle = {
    position: 'fixed',
    left: isOpen ? '155px' : '5px',
    top: '80px',
    padding: '8px 12px',
    backgroundColor: hoveredButton === 'toggle' ? '#34495e' : '#2c3e50',
    color: '#fff',
    border: 'none',
    borderRadius: '0 8px 8px 0',
    cursor: 'pointer',
    fontSize: '16px',
    zIndex: 1000,
    transition: 'all 0.3s ease-in-out',
    boxShadow: '3px 0 10px rgba(0,0,0,0.2)',
    transform: hoveredButton === 'toggle' ? 'scale(1.1)' : 'scale(1)',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  };

  const getButtonStyle = (buttonName) => ({
    ...styles.button,
    transform: hoveredButton === buttonName ? 'scale(1.05)' : 'scale(1)',
    boxShadow: hoveredButton === buttonName ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
    transition: 'all 0.2s ease-in-out'
  });

  return (
    <>
      <button
        className="print-hide"
        style={toggleButtonStyle}
        onClick={onToggle}
        onMouseEnter={() => setHoveredButton('toggle')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        {isOpen ? '<<' : '>>'}
      </button>
      <div style={sidebarStyle} className="print-hide">
        <button 
          style={getButtonStyle('addRow')}
          onClick={onAddRow}
          onMouseEnter={() => setHoveredButton('addRow')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          👥 인원추가
        </button>
        <button 
          style={getButtonStyle('addCourse')}
          onClick={onAddCourse}
          onMouseEnter={() => setHoveredButton('addCourse')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <span style={{ color: '#FFD700' }}>➕</span> 코스추가
        </button>
        <button 
          style={getButtonStyle('deleteCourse')}
          onClick={onDeleteCourse}
          onMouseEnter={() => setHoveredButton('deleteCourse')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <span style={{ color: '#FFD700' }}>➖</span> 코스삭제
        </button>
        <button 
          style={getButtonStyle('addDay')}
          onClick={onAddDay}
          onMouseEnter={() => setHoveredButton('addDay')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          📅 일차추가
        </button>
        <button 
          style={getButtonStyle('deleteDay')}
          onClick={onDeleteDay}
          onMouseEnter={() => setHoveredButton('deleteDay')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          📅 일차삭제
        </button>
        <button 
          style={getButtonStyle('addPar')}
          onClick={onOpenParModal}
          onMouseEnter={() => setHoveredButton('addPar')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          🎯 파 설정
        </button>
        <input
          type="file"
          accept=".json"
          onChange={onFileLoad}
          style={{ display: 'none' }}
          id="fileInput"
        />
        <button
          style={getButtonStyle('loadFile')}
          onClick={() => document.getElementById('fileInput').click()}
          onMouseEnter={() => setHoveredButton('loadFile')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          📂 불러오기
        </button>
        <button 
          style={getButtonStyle('saveFile')}
          onClick={onSaveFile}
          onMouseEnter={() => setHoveredButton('saveFile')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          💾 저장하기
        </button>
        <button
          style={getButtonStyle('captureTable')}
          onClick={onCaptureTable}
          onMouseEnter={() => setHoveredButton('captureTable')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          📸 이미지 저장
        </button>
        <button
          style={getButtonStyle('captureGroupSheet')}
          onClick={onCaptureGroupSheet}
          onMouseEnter={() => setHoveredButton('captureGroupSheet')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          조 용지
        </button>
        <button 
          style={getButtonStyle('printBusinessCards')}
          onClick={onPrintBusinessCards}
          onMouseEnter={() => setHoveredButton('printBusinessCards')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          명함 인쇄
        </button>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  onAddCourse: PropTypes.func.isRequired,
  onDeleteCourse: PropTypes.func.isRequired,
  onAddRow: PropTypes.func.isRequired,
  onAddDay: PropTypes.func.isRequired,
  onDeleteDay: PropTypes.func.isRequired,
  onFileLoad: PropTypes.func.isRequired,
  onSaveFile: PropTypes.func.isRequired,
  onCaptureTable: PropTypes.func.isRequired,
  onCaptureGroupSheet: PropTypes.func.isRequired,
  onPrintBusinessCards: PropTypes.func.isRequired,
  onOpenParModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
}; 