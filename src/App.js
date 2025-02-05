import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Sidebar } from './components/Sidebar';
import { TableHeader } from './components/TableHeader';
import { TableRow } from './components/TableRow';
import { useScoreData } from './hooks/useScoreData';
import { useModal } from './hooks/useModal';
import styles from './styles/styles';
import printStyles from './styles/printStyles';
import { ScoreModal } from './components/ScoreModal';
import { useTableEvents } from './hooks/useTableEvents';
import { DEFAULT_VALUES } from './constants/tableConstants';
import { calculateScores, calculateTotalScore } from './utils/scoreUtils';
import ReactDOMServer from 'react-dom/server';
import { BusinessCardSheet } from './components/BusinessCardSheet';
import { GroupSheet } from './components/GroupSheet';
import { ParSettingModal } from './components/ParSettingModal';
import { PasswordModal } from './components/PasswordModal';
import { renderBusinessCards } from './utils/businessCardUtils';

function App() {
  const {
    rows,
    setRows,
    courseColumns,
    setCourseColumns,
    tournamentName,
    setTournamentName,
    totalDays,
    setTotalDays,
    handleAddCourse,
    handleDeleteCourse,
    handleAddDay,
    handleDeleteDay,
    handleSort,
    validatePlayerAdd
  } = useScoreData();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [parData, setParData] = useState({});
  const [isParModalOpen, setIsParModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    modalData,
    setModalData,
    handleOpenScoreModal,
    handleCloseModal,
    handleScoreChange,
    handleDayChange
  } = useModal();

  const {
    handleFileLoad,
    handleSaveFile,
    handleCaptureTable,
    handleCaptureGroupSheet
  } = useTableEvents({
    rows,
    setRows,
    courseColumns,
    setCourseColumns,
    tournamentName,
    setTournamentName,
    totalDays,
    setTotalDays,
    parData,
    setParData
  });

  if (!isAuthenticated) {
    return (
      <PasswordModal
        isOpen={true}
        onSubmit={() => setIsAuthenticated(true)}
      />
    );
  }

  // 행 추가
  const handleAddRow = () => {
    const newCourses = {};
    courseColumns.forEach(col => {
      newCourses[col] = Array(9).fill(0);
    });
    const newRow = {
      group: '',
      name: '',
      region: '',
      startCourse: '',
      courses: newCourses,
      total: 0
    };
    setRows([...rows, newRow]);
  };

  // 행 업데이트
  const handleUpdateField = (index, field, value) => {
    const updated = [...rows];
    const row = { ...updated[index] };
    row[field] = value;

    // 조 번호가 변경된 경우에만 유효성 검사
    if (field === 'group' && !validatePlayerAdd(row)) {
      return;
    }

    updated[index] = row;
    setRows(updated);
  };

  // 행 삭제
  const handleDeleteRow = (idx) => {
    if (window.confirm('선수를 삭제하시겠습니까?')) {
      setRows(prev => prev.filter((_, i) => i !== idx));
    }
  };

  // 점수 모달 제출
  const handleSubmitScores = () => {
    if (!modalData) return;
    const { rowIndex, allScores } = modalData;
    
    setRows(prev => {
      const updated = [...prev];
      const row = { ...updated[rowIndex] };
      
      row.courses = calculateScores(allScores);
      row.total = calculateTotalScore(row.courses);
      
      updated[rowIndex] = row;
      return updated;
    });
    
    handleCloseModal();
  };

  const handlePrintBusinessCards = () => {
    const newTab = window.open('', '_blank');
    newTab.document.write(renderBusinessCards(rows, tournamentName));
    newTab.document.close();
    newTab.focus();
  };

  const handleParSubmit = (courseName, pars) => {
    setParData(prev => ({
      ...prev,
      [courseName]: {
        pars: pars.map(par => par === '' ? '' : parseInt(par))
      }
    }));
  };

  return (
    <>
      <style>{printStyles}</style>
      <div style={styles.container}>
        <div style={{ display: 'flex' }}>
          <div className="print-hide" style={styles.printModeToggle}>
            <div
              onClick={() => setIsPrintMode(!isPrintMode)}
              style={styles.toggleButton(isPrintMode)}
            >
              <div style={styles.toggleKnob(isPrintMode)} />
            </div>
            <span style={styles.toggleLabel}>인쇄 모드</span>
          </div>

          <Sidebar
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddRow={handleAddRow}
            onAddDay={handleAddDay}
            onDeleteDay={handleDeleteDay}
            onFileLoad={handleFileLoad}
            onSaveFile={handleSaveFile}
            onCaptureTable={handleCaptureTable}
            onCaptureGroupSheet={handleCaptureGroupSheet}
            onPrintBusinessCards={handlePrintBusinessCards}
            onOpenParModal={() => setIsParModalOpen(true)}
            isOpen={isSidebarOpen && !isPrintMode}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <div 
            id="printArea"
            style={{ 
              marginLeft: (isSidebarOpen && !isPrintMode) ? '180px' : '30px', 
              flex: 1,
              background: '#ffffff',
              padding: '15px',
              position: 'relative',
              transition: 'margin-left 0.3s ease-in-out'
            }}
          >
            <div id="captureArea">
              <div
                style={styles.header}
                contentEditable
                suppressContentEditableWarning={true}
                onBlur={(e) => setTournamentName(e.target.innerText)}
              >
                {tournamentName || "대회이름입력"}
              </div>

              <div style={{ overflow: 'auto' }}>
                <table style={{
                  ...styles.table,
                  tableLayout: 'fixed',
                  width: '100%'
                }}>
                  <colgroup>
                    {!isPrintMode && <col style={{ width: '70px' }} />}
                    <col style={{ width: '40px' }} />
                    <col style={{ width: '60px' }} />
                    <col style={{ width: '60px' }} />
                    <col style={{ width: '60px' }} />
                    {courseColumns.map((_, idx) => (
                      <col key={idx} style={{ width: '60px' }} />
                    ))}
                    <col style={{ width: '60px' }} />
                    <col style={{ width: '60px' }} />
                  </colgroup>
                  <TableHeader
                    courseColumns={courseColumns}
                    onSort={handleSort}
                    isPrintMode={isPrintMode}
                  />
                  <tbody>
                    {rows.map((row, idx) => (
                      <TableRow
                        key={idx}
                        row={row}
                        rowIndex={idx}
                        courseColumns={courseColumns}
                        onOpenScoreModal={() => handleOpenScoreModal(idx, row.courses, totalDays)}
                        onDeleteRow={handleDeleteRow}
                        onUpdateField={handleUpdateField}
                        allRows={rows}
                        isPrintMode={isPrintMode}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalData && !isPrintMode && (
        <ScoreModal
          modalData={modalData}
          onSubmit={handleSubmitScores}
          onClose={handleCloseModal}
          onScoreChange={handleScoreChange}
          onDayChange={(day) => handleDayChange(day, rows[modalData.rowIndex].courses)}
        />
      )}

      <ParSettingModal
        isOpen={isParModalOpen}
        onClose={() => setIsParModalOpen(false)}
        onSubmit={handleParSubmit}
        courseColumns={courseColumns}
        parData={parData}
      />
    </>
  );
}

export default App;
