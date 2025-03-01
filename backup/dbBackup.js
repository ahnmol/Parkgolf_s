// parkgolf_server/backup/dbBackup.js
require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');

// 메인 DB와 백업 DB의 연결 문자열
const MAIN_DB_URI = process.env.MAIN_DB_URI;
const BACKUP_DB_URI = process.env.BACKUP_DB_URI;

// 환경 변수 체크
if (!MAIN_DB_URI || !BACKUP_DB_URI) {
    console.error('환경 변수가 설정되지 않았습니다. MAIN_DB_URI와 BACKUP_DB_URI를 확인해주세요.');
    process.exit(1);
}

// 백업 함수
async function performBackup() {
    let mainConn = null;
    let backupConn = null;
    
    try {
        console.log('메인 DB 연결 시도...');
        // 메인 DB 연결
        mainConn = await mongoose.createConnection(MAIN_DB_URI).asPromise();
        console.log('메인 DB 연결 성공');
        
        console.log('백업 DB 연결 시도...');
        // 백업 DB 연결
        backupConn = await mongoose.createConnection(BACKUP_DB_URI).asPromise();
        console.log('백업 DB 연결 성공');
        
        // 연결이 완료될 때까지 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('컬렉션 목록 가져오기 시도...');
        // 모든 컬렉션 가져오기
        const collections = await mainConn.db.listCollections().toArray();
        console.log(`총 ${collections.length}개의 컬렉션 발견`);
        
        for (const collection of collections) {
            const collectionName = collection.name;
            console.log(`${collectionName} 백업 시작...`);
            
            // 기존 백업 데이터 삭제
            await backupConn.db.collection(collectionName).deleteMany({});
            
            // 현재 데이터 가져오기
            const data = await mainConn.db.collection(collectionName).find({}).toArray();
            
            // 데이터가 있는 경우에만 백업
            if (data.length > 0) {
                await backupConn.db.collection(collectionName).insertMany(data);
                console.log(`${collectionName} 백업 완료: ${data.length}개 문서`);
            } else {
                console.log(`${collectionName}에는 백업할 데이터가 없습니다.`);
            }
        }
        
        console.log('전체 백업 완료:', new Date().toISOString());
    } catch (error) {
        console.error('백업 중 오류 발생:', error);
    } finally {
        // 연결 종료
        if (mainConn) {
            await mainConn.close();
            console.log('메인 DB 연결 종료');
        }
        if (backupConn) {
            await backupConn.close();
            console.log('백업 DB 연결 종료');
        }
    }
}

// 매일 새벽 3시에 실행되는 크론 작업 설정
cron.schedule('0 3 * * *', () => {
    console.log('백업 시작:', new Date().toISOString());
    performBackup();
}, { timezone: 'Asia/Seoul' });

// 서비스 시작 시 즉시 백업 실행
console.log('서비스 시작 시 초기 백업 실행:', new Date().toISOString());
performBackup();

console.log('백업 스케줄러 등록 완료: 한국 시간 기준 새벽 3시에 실행됩니다.');

module.exports = { performBackup };