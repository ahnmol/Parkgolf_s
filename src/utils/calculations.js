export const calculateTotal = (courses) => {
  return Object.values(courses).reduce(
    (sum, arr) => sum + arr.reduce((a,b)=>a+(b||0), 0),
    0
  );
};

// 코스별 점수 합계를 계산하는 함수
const calculateCourseTotal = (courses, courseName) => {
  return courses[courseName]?.reduce((sum, score) => sum + (score || 0), 0) || 0;
};

// 두 선수를 비교하는 함수
const compareRows = (a, b) => {
  const aTotal = a.total || 0;
  const bTotal = b.total || 0;

  if (aTotal !== bTotal) {
    return aTotal - bTotal;
  }

  // 총점이 같을 경우 코스별로 비교 (D > C > B > A 순서)
  const courseOrder = ['D', 'C', 'B', 'A'];
  for (const courseLetter of courseOrder) {
    // 각 일차의 해당 코스 점수를 비교
    const aCourseScores = Object.keys(a.courses)
      .filter(key => key.startsWith(courseLetter + '_'))
      .map(key => calculateCourseTotal(a.courses, key));
    const bCourseScores = Object.keys(b.courses)
      .filter(key => key.startsWith(courseLetter + '_'))
      .map(key => calculateCourseTotal(b.courses, key));
    
    // 해당 코스가 존재하면 비교
    if (aCourseScores.length > 0 && bCourseScores.length > 0) {
      const aCourseTotal = aCourseScores.reduce((sum, score) => sum + score, 0);
      const bCourseTotal = bCourseScores.reduce((sum, score) => sum + score, 0);
      
      if (aCourseTotal !== bCourseTotal) {
        return aCourseTotal - bCourseTotal;
      }
    }
  }
  return 0; // 모든 코스가 같으면 동점
};

export const getRank = (targetRow, allRows) => {
  let rank = 1;
  allRows.forEach(row => {
    if (compareRows(targetRow, row) > 0) rank++;
  });
  return rank;
};

export const sortRows = (rows, key, direction) => {
  return [...rows].sort((a, b) => {
    let aVal, bVal;
    
    switch (key) {
      case '조': 
        aVal = parseInt(a.group) || 0;
        bVal = parseInt(b.group) || 0;
        break;
      case '성명': aVal = a.name || ''; bVal = b.name || ''; break;
      case '시/도': aVal = a.region || ''; bVal = b.region || ''; break;
      case '시작코스': aVal = a.startCourse || ''; bVal = b.startCourse || ''; break;
      case '총 합계': 
      case '순위':
        const comparison = compareRows(a, b);
        return direction === 'ascending' ? comparison : -comparison;
      default:
        if (key.includes('일차') && a.courses && b.courses) {
          aVal = (a.courses[key] || []).reduce((sum, score) => sum + (parseInt(score) || 0), 0);
          bVal = (b.courses[key] || []).reduce((sum, score) => sum + (parseInt(score) || 0), 0);
        } else {
          aVal = ''; bVal = '';
        }
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'ascending' ? aVal - bVal : bVal - aVal;
    }
    
    return direction === 'ascending'
      ? String(aVal).localeCompare(String(bVal), 'ko')
      : String(bVal).localeCompare(String(aVal), 'ko');
  });
}; 