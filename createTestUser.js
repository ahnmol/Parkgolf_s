/**
 * MongoDB에 테스트 사용자를 생성하는 스크립트
 * 
 * 사용법: node createTestUser.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB 연결
const MAIN_DB_URI = process.env.MAIN_DB_URI || 'mongodb://localhost:27017/parkgolf';
mongoose.connect(MAIN_DB_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

// 사용자 스키마
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// 테스트 사용자 생성
async function createTestUser() {
  try {
    // 기존 테스트 사용자가 있는지 확인
    const existingUser = await User.findOne({ username: 'test' });
    
    if (existingUser) {
      console.log('테스트 사용자가 이미 존재합니다.');
      return;
    }
    
    // 새 테스트 사용자 생성
    const testUser = new User({
      username: 'test',
      password: '1234'
    });
    
    await testUser.save();
    console.log('테스트 사용자가 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('테스트 사용자 생성 중 오류 발생:', error);
  } finally {
    // 연결 종료
    mongoose.connection.close();
  }
}

// 스크립트 실행
createTestUser(); 