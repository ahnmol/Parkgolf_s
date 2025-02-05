import React from 'react';
import PropTypes from 'prop-types';

const cardStyles = {
  container: {
    width: '297mm',  // A4 height
    height: '210mm',  // A4 width
    padding: '5mm',
    backgroundColor: 'white',
    boxSizing: 'border-box',
    transform: 'rotate(90deg)',
    transformOrigin: 'top left',
    position: 'absolute',
    left: '0',
    top: '297mm',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 58mm)',
    gridTemplateRows: 'repeat(3, 95mm)',
    gap: '5mm',
    height: '100%',
  },
  card: {
    border: '10px solid #000',
    padding: '12mm',
    display: 'flex',
    flexDirection: 'column',
    height: '58mm',
    width: '95mm',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    transform: 'rotate(-90deg) scale(0.8)',
    transformOrigin: 'center center',
  },
  header: {
    marginBottom: '2mm',
    padding: '1mm 0',
    textAlign: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    borderBottom: '1px solid #000',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gap: '0',
    border: '1px solid #000',
    flex: 1,
    position: 'relative',
    height: '25mm',
    width: '65mm',
    margin: 'auto',
    transform: 'scale(0.8)',
    transformOrigin: 'center center',
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5mm',
    fontSize: '10px',
    fontWeight: 'bold',
    position: 'relative',
    lineHeight: '1',
  },
  lastColumnCell: {
    '&::after': {
      display: 'none',
    }
  },
  lastRowCell: {
    '&::before': {
      display: 'none',
    }
  },
  nameCell: {
    fontSize: '1px',
  }
};

export const BusinessCardSheet = ({ rows, tournamentName }) => {
  return (
    <div style={{ width: '210mm', height: '297mm', position: 'relative', overflow: 'hidden' }}>
      <div style={cardStyles.container}>
        <div style={cardStyles.cardGrid}>
          {rows.map((row, index) => (
            <div key={index} style={cardStyles.card}>
              <div style={cardStyles.header}>
                {tournamentName}
              </div>
              <div style={cardStyles.content}>
                <div style={{
                  ...cardStyles.cell,
                  borderRight: '1px solid #000',
                  borderBottom: '1px solid #000',
                }}>
                  <span style={{ fontSize: '8px' }}>{row.group + '그룹'}</span>
                </div>
                <div style={{
                  ...cardStyles.cell,
                  borderBottom: '1px solid #000',
                }}>
                  <span style={{ fontSize: '8px' }}>{row.region}</span>
                </div>
                <div style={{
                  ...cardStyles.cell,
                  borderRight: '1px solid #000',
                }}>
                  <span style={{ fontSize: '8px' }}>{row.startCourse}</span>
                </div>
                <div style={{
                  ...cardStyles.cell,
                }}>
                  <span style={{ fontSize: '8px' }}>{row.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

BusinessCardSheet.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.string,
      name: PropTypes.string,
      region: PropTypes.string,
      startCourse: PropTypes.string,
    })
  ).isRequired,
  tournamentName: PropTypes.string.isRequired,
}; 