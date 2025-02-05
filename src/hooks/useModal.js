import { useState } from 'react';

export const useModal = () => {
  const [modalData, setModalData] = useState(null);

  const handleOpenScoreModal = (rowIndex, courses, totalDays) => {
    if (!courses || !Object.keys(courses).length) {
      alert("먼저 코스를 추가하세요.");
      return;
    }
    
    const allScores = {};
    Object.keys(courses).forEach(col => {
      allScores[col] = courses[col].map(v => v === 0 ? '' : v.toString());
    });
    
    const initialScores = {};
    Object.keys(courses).forEach(col => {
      if (col.includes('_1일차')) {
        initialScores[col] = allScores[col];
      }
    });
    
    setModalData({ 
      rowIndex, 
      scores: initialScores,
      selectedDay: 1,
      totalDays,
      allScores
    });
  };

  const handleCloseModal = () => {
    setModalData(null);
  };

  const handleScoreChange = (courseKey, holeIndex, value) => {
    setModalData(prev => {
      const newScores = { ...prev.scores };
      const newAllScores = { ...prev.allScores };
      
      newScores[courseKey][holeIndex] = value;
      newAllScores[courseKey][holeIndex] = value;
      
      return {
        ...prev,
        scores: newScores,
        allScores: newAllScores
      };
    });
  };

  const handleDayChange = (day, courses) => {
    setModalData(prev => {
      const newScores = {};
      Object.keys(prev.allScores).forEach(col => {
        if (col.includes(`_${day}일차`)) {
          newScores[col] = prev.allScores[col];
        }
      });

      return {
        ...prev,
        selectedDay: day,
        scores: newScores
      };
    });
  };

  return {
    modalData,
    setModalData,
    handleOpenScoreModal,
    handleCloseModal,
    handleScoreChange,
    handleDayChange
  };
}; 