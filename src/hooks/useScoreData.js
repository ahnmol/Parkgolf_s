import { useState } from 'react';
import { sortRows } from '../utils/calculations';

export const useScoreData = () => {
  const [rows, setRows] = useState([]);
  const [courseColumns, setCourseColumns] = useState([]);
  const [tournamentName, setTournamentName] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [totalDays, setTotalDays] = useState(1);

  // 코스 컬럼을 일차별로 정렬하는 함수
  const sortCourseColumns = (columns) => {
    const letters = [...new Set(columns.map(col => col.split('_')[0]))];
    const days = [...new Set(columns.map(col => parseInt(col.split('_')[1])))];
    
    const sorted = [];
    for (let day of days) {
      for (let letter of letters) {
        const column = columns.find(col => col.startsWith(`${letter}_${day}일차`));
        if (column) sorted.push(column);
      }
    }
    return sorted;
  };

  const handleAddCourse = () => {
    // 현재 존재하는 고유한 코스 문자 수 계산
    const uniqueLetters = new Set(
      courseColumns.map(col => col.split('_')[0])
    ).size;
    
    // D코스(4개) 이상 추가 방지
    if (uniqueLetters >= 4) {
      alert('코스는 최대 D코스(4개)까지만 추가할 수 있습니다.');
      return;
    }

    // 다음 코스 문자 계산 (A, B, C, D)
    const nextLetter = String.fromCharCode(65 + uniqueLetters);
    
    // 새로운 코스를 각 일차에 추가
    const newCourses = Array.from({ length: totalDays }, (_, i) => 
      `${nextLetter}_${i + 1}일차 합계`
    );

    // 모든 행에 새 코스 추가
    const updated = rows.map(r => {
      const newCoursesObj = {};
      newCourses.forEach(course => {
        newCoursesObj[course] = Array(9).fill(0);
      });
      return {
        ...r,
        courses: { ...r.courses, ...newCoursesObj }
      };
    });

    // 코스 컬럼을 일차별로 정렬하여 설정
    const newColumns = sortCourseColumns([...courseColumns, ...newCourses]);
    setCourseColumns(newColumns);
    setRows(updated);
  };

  const handleDeleteCourse = () => {
    if (!courseColumns.length) return;
    
    if (!window.confirm('마지막 코스를 삭제하시겠습니까? 해당 코스의 모든 일차 데이터가 삭제됩니다.')) {
      return;
    }
    
    // 마지막 코스 문자 찾기
    const lastLetter = [...new Set(courseColumns.map(col => col.split('_')[0]))].pop();
    
    // 해당 코스의 모든 일차 컬럼 제거
    const newCols = courseColumns.filter(col => !col.startsWith(lastLetter));

    const updated = rows.map(r => {
      const c = { ...r.courses };
      courseColumns.filter(col => col.startsWith(lastLetter)).forEach(col => {
        delete c[col];
      });
      const newTotal = Object.values(c).reduce((sum, arr) => sum + arr.reduce((a,b)=>a+(b||0),0), 0);
      return { ...r, courses: c, total: newTotal };
    });

    setCourseColumns(newCols);
    setRows(updated);
  };

  const handleAddDay = () => {
    const newTotalDays = totalDays + 1;
    const existingCourseLetters = new Set(
      courseColumns.map(col => col.split('_')[0])
    );

    // 각 코스에 대해 새로운 일차 추가
    const newCourses = Array.from(existingCourseLetters).map(
      letter => `${letter}_${newTotalDays}일차 합계`
    );

    const updated = rows.map(r => {
      const newCoursesObj = {};
      newCourses.forEach(course => {
        newCoursesObj[course] = Array(9).fill(0);
      });
      return {
        ...r,
        courses: { ...r.courses, ...newCoursesObj }
      };
    });

    // 코스 컬럼을 일차별로 정렬하여 설정
    const newColumns = sortCourseColumns([...courseColumns, ...newCourses]);
    setCourseColumns(newColumns);
    setRows(updated);
    setTotalDays(newTotalDays);
  };

  const handleDeleteDay = () => {
    if (totalDays <= 1) {
      alert("최소 1일차는 유지해야 합니다.");
      return;
    }

    if (!window.confirm(`${totalDays}일차의 모든 코스 데이터가 삭제됩니다. 계속하시겠습니까?`)) {
      return;
    }

    // 마지막 일차의 모든 코스 컬럼 제거
    const newCols = courseColumns.filter(col => !col.includes(`_${totalDays}일차`));

    const updated = rows.map(r => {
      const c = { ...r.courses };
      courseColumns.filter(col => col.includes(`_${totalDays}일차`)).forEach(col => {
        delete c[col];
      });
      const newTotal = Object.values(c).reduce((sum, arr) => sum + arr.reduce((a,b)=>a+(b||0),0), 0);
      return { ...r, courses: c, total: newTotal };
    });

    setCourseColumns(newCols);
    setRows(updated);
    setTotalDays(totalDays - 1);
  };

  // 선수 추가 시 유효성 검사
  const validatePlayerAdd = (newPlayer) => {
    // 해당 조의 선수 수 확인
    const sameGroupPlayers = rows.filter(r => r.group === newPlayer.group);
    if (sameGroupPlayers.length >= 4) {
      alert('한 조당 최대 4명까지만 등록할 수 있습니다.');
      return false;
    }
    return true;
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedRows = sortRows(rows, key, direction);
    setRows(sortedRows);
  };

  return {
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
  };
}; 