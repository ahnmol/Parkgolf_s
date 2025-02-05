export const saveToFile = (data, fileName) => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const loadFromFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const jsonData = JSON.parse(ev.target.result);
        resolve(jsonData);
      } catch (err) {
        reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
      }
    };
    reader.readAsText(file);
  });
}; 