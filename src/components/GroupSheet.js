import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';

export const GroupSheet = ({ group, players, courseColumns, tournamentName, parData }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    border: '2px solid #000',
    fontSize: '13px',
    pageBreakInside: 'avoid',
    tableLayout: 'fixed'
  };

  const cellStyle = {
    border: '1px solid #000',
    padding: '1px 1px 2px 1px',  
    textAlign: 'center',
    height: '32px',
    fontSize: '14.5px',  
    borderWidth: '1px',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  };

  const headerCellStyle = {
    ...cellStyle,
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  };

  const skyBlueHeaderStyle = {
    ...headerCellStyle,
    backgroundColor: '#e3f2fd',
    fontSize: '17px',
    height: '40px'
  };

  const parCellStyle = {
    ...cellStyle,
    color: '#000',
    backgroundColor: '#f9f9f9',
    width: '38px'
  };

  const holeCellStyle = {
    ...headerCellStyle,
    width: '28px'
  };

  const parNumberStyle = {
    fontSize: '17px',
    fontWeight: 'bold',
    lineHeight: '1.2'
  };

  const parDistanceStyle = {
    fontSize: '10px',
    color: '#666',
    marginTop: '1px'
  };

  const scoreCellStyle = {
    ...cellStyle,
    backgroundColor: '#fff',
    width: '48px'
  };

  const chineseCharStyle = {
    ...cellStyle,
    color: '#888',
    fontFamily: 'serif',
    fontSize: '16px',
    width: '22px'
  };

  const chineseHeaderStyle = {
    ...headerCellStyle,
    fontFamily: 'serif',
    fontSize: '16px',
    width: '22px'
  };

  const getParInfo = (courseName, holeNumber) => {
    const baseName = courseName.split('_')[0];
    const courseParData = parData[baseName];
    if (!courseParData) return { par: '', distance: '' };
    return { 
      par: courseParData.pars[holeNumber - 1] || '',
      distance: ''  // 거리는 아직 구현하지 않음
    };
  };

  const renderCourseTable = (courseName, coursePlayers) => {
    const totalCols = 2 + (coursePlayers.length * 2);

    return (
      <table style={tableStyle}>
        <thead>
          <tr>
            <th colSpan={totalCols} style={skyBlueHeaderStyle} className="course-title">
              {group}조 - {courseName} (남,여)
            </th>
          </tr>
          <tr>
            <th colSpan="2" style={skyBlueHeaderStyle}>이름</th>
            {coursePlayers.map((player, idx) => (
              <th key={idx} style={{...headerCellStyle, padding: '1px'}} colSpan="2" className="player-name">
                <div style={{ fontSize: '14.5px', fontWeight: 'bold' }}>
                  {player.name || `선수 ${idx + 1}`}
                </div>
              </th>
            ))}
          </tr>
          <tr>
            <th style={holeCellStyle}>홀</th>
            <th style={parCellStyle}>파</th>
            {coursePlayers.map((_, idx) => (
              <React.Fragment key={idx}>
                <th style={chineseHeaderStyle}>正</th>
                <th style={headerCellStyle}>타수</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(9)].map((_, i) => {
            const parInfo = getParInfo(courseName, i + 1);
            return (
              <tr key={i}>
                <td style={holeCellStyle}>{i + 1}</td>
                <td style={parCellStyle}>
                  <div style={parNumberStyle}>{parInfo.par}</div>
                </td>
                {coursePlayers.map((_, playerIdx) => (
                  <React.Fragment key={playerIdx}>
                    <td style={chineseCharStyle}>正</td>
                    <td style={scoreCellStyle}></td>
                  </React.Fragment>
                ))}
              </tr>
            );
          })}
          {/* 소계 행 */}
          <tr>
            <td style={{...headerCellStyle, height: '28px'}} colSpan="2">소계</td>
            {coursePlayers.map((_, playerIdx) => (
              <td key={playerIdx} style={{...scoreCellStyle, height: '28px'}} colSpan="2"></td>
            ))}
          </tr>
          {/* 서명 행 */}
          <tr>
            <td style={{...headerCellStyle, height: '32px'}} colSpan="2">서명</td>
            {coursePlayers.map((_, playerIdx) => (
              <td key={playerIdx} style={{...scoreCellStyle, height: '32px'}} colSpan="2"></td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };

  const uniqueCourses = courseColumns
    .filter((col, index, self) => 
      index === self.findIndex(t => t.split('_')[0] === col.split('_')[0])
    )
    .map(col => col.split('_')[0]);

  return (
    <>
      <div 
        ref={componentRef}
        style={{ 
          width: '210mm',
          minHeight: '297mm',
          margin: '0',
          padding: '0',
          background: 'white',
          position: 'relative',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        <style type="text/css" media="print">
          {`
            @page {
              size: A4 portrait;
              margin: 0;
              padding: 0;
            }
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
                background: white;
              }
              #printArea {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .score-card {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin-bottom: 1mm !important;
              }
              table {
                font-size: 11px !important;
                transform: scale(0.98) !important;
                transform-origin: top center !important;
              }
              th, td {
                padding: 0 !important;
              }
            }
          `}
        </style>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1mm',
          height: 'auto',
          maxWidth: '210mm',
          margin: '0',
          padding: '1mm',
          alignContent: 'start'
        }}>
          {uniqueCourses.map((courseName, idx) => (
            <div 
              key={idx} 
              className="score-card"
              style={{
                width: '100%',
                margin: '0',
                marginBottom: '1mm'
              }}
            >
              <div style={{
                textAlign: 'center',
                marginBottom: '0.5mm',
                fontSize: '19px',
                fontWeight: 'bold',
                paddingTop: '0'
              }}>
                {tournamentName}
              </div>
              {renderCourseTable(courseName, players)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

GroupSheet.propTypes = {
  group: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      region: PropTypes.string
    })
  ).isRequired,
  courseColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  tournamentName: PropTypes.string.isRequired,
  parData: PropTypes.object.isRequired
}; 