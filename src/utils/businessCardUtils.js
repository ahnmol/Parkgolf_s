import { businessCardStyles } from '../styles/businessCardStyles';

export const renderBusinessCards = (rows, tournamentName) => {
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>명함 인쇄</title>
        <style>${businessCardStyles.printStyles}</style>
      </head>
      <body>
        ${Array.from({ length: Math.ceil(rows.length / 9) }, (_, pageIndex) => {
          const pageRows = rows.slice(pageIndex * 9, (pageIndex + 1) * 9);
          if (pageRows.length === 0) return '';
          return `
            <div class="page" style="${styleToString(businessCardStyles.page)}">
              <div class="card-container" style="${styleToString(businessCardStyles.cardContainer)}">
                ${pageRows.map(row => `
                  <div class="card" style="${styleToString(businessCardStyles.card)}">
                    <div class="card-header" style="${styleToString(businessCardStyles.cardHeader)}">${tournamentName}</div>
                    <div class="card-content" style="${styleToString(businessCardStyles.cardContent)}">
                      <div class="cell" style="${styleToString({...businessCardStyles.cell, borderBottom: '1px solid black'})}">${row.group}그룹</div>
                      <div class="cell" style="${styleToString({...businessCardStyles.cell, borderRight: 'none', borderBottom: '1px solid black', fontSize: '32px'})}">${row.region}</div>
                      <div class="cell" style="${styleToString({...businessCardStyles.cell, borderBottom: 'none'})}">${row.startCourse}</div>
                      <div class="cell" style="${styleToString({...businessCardStyles.cell, borderRight: 'none', borderBottom: 'none', fontSize: '60px', lineHeight: '0.9', padding: '0'})}">${row.name}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).filter(Boolean).join('')}
      </body>
    </html>
  `;
};

// React 스타일 객체를 CSS 문자열로 변환하는 헬퍼 함수
const styleToString = (style) => {
  return Object.entries(style)
    .map(([key, value]) => `${kebabCase(key)}: ${value}`)
    .join('; ');
};

// camelCase를 kebab-case로 변환하는 헬퍼 함수
const kebabCase = (str) => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}; 