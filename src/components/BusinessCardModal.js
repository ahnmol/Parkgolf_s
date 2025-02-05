import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/styles';
import { BusinessCardSheet } from './BusinessCardSheet';

const modalStyles = {
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
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeButton: {
    ...styles.button,
    padding: '5px 10px',
    backgroundColor: '#ff3b30',
  },
  printButton: {
    ...styles.button,
    padding: '5px 10px',
    backgroundColor: '#007aff',
    marginRight: '10px',
  },
};

export const BusinessCardModal = ({ isOpen, onClose, rows, tournamentName }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    const printContents = document.getElementById("businessCardPrintArea");
    if (printContents) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>명함 인쇄</title></head><body>');
      printWindow.document.write(printContents.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
    } else {
      console.error('Business card print container not found!');
    }
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <div>
            <button style={modalStyles.printButton} onClick={handlePrint}>
              인쇄
            </button>
            <button style={modalStyles.closeButton} onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
        <div id="businessCardPrintArea">
          <BusinessCardSheet rows={rows} tournamentName={tournamentName} />
        </div>
      </div>
    </div>
  );
};

BusinessCardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  tournamentName: PropTypes.string.isRequired,
}; 