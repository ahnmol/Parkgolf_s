import { saveToFile, loadFromFile } from '../utils/fileHandlers';
import html2canvas from 'html2canvas';
import React from 'react';
import ReactDOM from 'react-dom';
import { GroupSheet } from '../components/GroupSheet';
import { calculateTotalScore } from '../utils/scoreUtils';

export const useTableEvents = ({
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
}) => {
  const handleFileLoad = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        // 각 행에 대해 총합계 계산
        const updatedRows = data.rows.map(row => ({
          ...row,
          total: calculateTotalScore(row.courses)
        }));
        data.rows = updatedRows;
        
        setRows(data.rows);
        setCourseColumns(data.courseColumns);
        setTournamentName(data.tournamentName);
        // 일차 수 계산
        const days = new Set(data.courseColumns.map(col => parseInt(col.split('_')[1])));
        setTotalDays(days.size);
        // parData 복원
        if (data.parData) {
          setParData(data.parData);
        }
      } catch (error) {
        console.error('파일 로드 중 오류 발생:', error);
        alert('파일 형식이 올바르지 않습니다.');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveFile = () => {
    const data = {
      tournamentName,
      courseColumns,
      rows,
      totalDays,
      parData
    };
    saveToFile(data, `${tournamentName || '대회'}.json`);
  };

  const handleCaptureTable = async () => {
    try {
      // 임시로 프린트 모드 스타일 적용
      const printArea = document.getElementById('printArea');
      const originalStyle = printArea.style.cssText;
      
      // 캡처를 위한 스타일 적용
      printArea.style.cssText = `
        margin: 0 !important;
        padding: 10px !important;
        width: 100% !important;
        background-color: white !important;
        display: flex !important;
        justify-content: center !important;
      `;

      // 테이블 스타일 임시 저장 및 수정
      const table = printArea.querySelector('table');
      const originalTableStyle = table.style.cssText;
      table.style.cssText = `
        width: 98% !important;
        margin: 0 auto !important;
        table-layout: fixed !important;
      `;

      // 액션 열 숨기기
      const actionColumns = document.querySelectorAll('.action-column');
      actionColumns.forEach(col => {
        col.style.display = 'none';
      });

      const canvas = await html2canvas(printArea, {
        scale: 2, // 해상도 2배 증가
        useCORS: true,
        backgroundColor: '#ffffff',
        width: printArea.scrollWidth,
        height: printArea.scrollHeight,
        windowWidth: printArea.scrollWidth,
        windowHeight: printArea.scrollHeight
      });

      // 원래 스타일로 복구
      printArea.style.cssText = originalStyle;
      table.style.cssText = originalTableStyle;
      actionColumns.forEach(col => {
        col.style.display = '';
      });

      // 이미지 저장
      const link = document.createElement('a');
      link.download = `${tournamentName || '파크골프'}_점수표.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('이미지 저장 중 오류 발생:', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  };

  const handleCaptureGroupSheet = async () => {
    // 조별로 선수들을 그룹화
    const groupedPlayers = rows.reduce((acc, player) => {
      const group = player.group || '미지정';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(player);
      return acc;
    }, {});

    // 새 탭 생성
    const newTab = window.open('', '_blank');
    newTab.document.write(`
      <html>
        <head>
          <meta charset="utf-8">
          <title>${tournamentName} - 조 용지</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            html {
              background: #eee;
            }
            body {
              margin: 0;
              padding: 0;
              background: #eee;
            }
            .page {
              width: 210mm;
              height: 297mm;
              padding: 10mm;
              margin: 10mm auto;
              background: white;
              box-sizing: border-box;
              page-break-after: always;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .page:last-child {
              page-break-after: auto;
            }
            @media print {
              html, body {
                background: white;
                height: auto;
              }
              .page {
                margin: 0;
                padding: 10mm;
                height: 297mm;
                page-break-after: always;
              }
              .page:last-child {
                page-break-after: auto;
              }
            }
          </style>
        </head>
        <body>
    `);

    // 임시 컨테이너 생성
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 210mm;
      height: 297mm;
      background: white;
      padding: 0;
    `;
    document.body.appendChild(container);

    try {
      // 각 조별로 이미지 생성
      for (const [group, players] of Object.entries(groupedPlayers)) {
        // GroupSheet 렌더링
        ReactDOM.render(
          <GroupSheet
            group={group}
            players={players}
            courseColumns={courseColumns}
            tournamentName={tournamentName}
            parData={parData}
          />,
          container
        );

        // 잠시 대기하여 렌더링이 완료되도록 함
        await new Promise(resolve => setTimeout(resolve, 100));

        // 이미지 캡처
        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: container.offsetWidth,
          height: container.offsetHeight,
          windowWidth: 210 * 3.78,  // mm to px
          windowHeight: 297 * 3.78
        });

        // 이미지를 새 탭에 추가
        const image = canvas.toDataURL('image/png', 1.0);
        newTab.document.write(`
          <div class="page">
            <img src="${image}" style="width: 100%; height: auto;">
          </div>
        `);
      }

      // HTML 문서 완성
      newTab.document.write('</body></html>');
      newTab.document.close();
      newTab.focus();
    } catch (error) {
      console.error('조 용지 생성 중 오류 발생:', error);
      alert('조 용지 생성 중 오류가 발생했습니다.');
    } finally {
      // 임시 컨테이너 제거
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    }
  };

  return {
    handleFileLoad,
    handleSaveFile,
    handleCaptureTable,
    handleCaptureGroupSheet
  };
}; 