const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const saveScoreData = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('데이터 저장에 실패했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('저장 오류:', error);
    throw error;
  }
};

export const loadScoreData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/scores`);
    
    if (!response.ok) {
      throw new Error('데이터 로드에 실패했습니다.');
    }
    
    const scores = await response.json();
    return scores[0]; // 가장 최근 데이터 반환
  } catch (error) {
    console.error('로드 오류:', error);
    throw error;
  }
}; 