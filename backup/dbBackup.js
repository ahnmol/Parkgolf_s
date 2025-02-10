// parkgolf_server/backup/dbBackup.js

const mongoose = require('mongoose');
const cron = require('node-cron');

// 메인 DB와 백업 DB의 연결 문자열
const MAIN_DB_URI = process.env.MAIN_DB_URI;
const BACKUP_DB_URI = process.env.BACKUP_DB_URI;

// 백업 함수
async function performBackup() {
    try {
        // 메인 DB 연결
        const mainConn = await mongoose.createConnection(MAIN_DB_URI);
        
        // 백업 DB 연결
        const backupConn = await mongoose.createConnection(BACKUP_DB_URI);
        
        // 모든 컬렉션 가져오기
        const collections = await mainConn.db.listCollections().toArray();
        
        for (const collection of collections) {
            const collectionName = collection.name;
            
            // 기존 백업 데이터 삭제
            await backupConn.db.collection(collectionName).deleteMany({});
            
            // 현재 데이터 가져오기
            const data = await mainConn.db.collection(collectionName).find({}).toArray();
            
            // 데이터가 있는 경우에만 백업
            if (data.length > 0) {
                await backupConn.db.collection(collectionName).insertMany(data);
                console.log(`${collectionName} 백업 완료: ${data.length}개 문서`);
            }
        }
        
        // 연결 종료
        await mainConn.close();
        await backupConn.close();
        
        console.log('전체 백업 완료:', new Date().toISOString());
    } catch (error) {
        console.error('백업 중 오류 발생:', error);
    }
}

// 매일 새벽 3시에 실행되는 크론 작업 설정
cron.schedule('0 3 * * *', () => {
    console.log('백업 시작:', new Date().toISOString());
    performBackup();
}, { timezone: 'Asia/Seoul' });

console.log('백업 스케줄러 등록 완료: 한국 시간 기준 새벽 3시에 실행됩니다.');

module.exports = { performBackup };