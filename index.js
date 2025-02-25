const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
require('./backup/dbBackup');
console.log('백업 시스템 초기화 완료: 백업 스케줄러가 등록되었습니다.');

const app = express();

// CORS 설정
const corsOptions = {
    origin: [
        'https://pkgolf.kr',
        'http://pkgolf.kr',
        'https://www.pkgolf.kr',
        'http://www.pkgolf.kr',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400 // CORS 프리플라이트 요청 캐시 시간 (24시간)
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// MongoDB 연결
const MAIN_DB_URI = process.env.MAIN_DB_URI || 'mongodb://localhost:27017/parkgolf';
console.log('MongoDB URI 확인 (민감 정보 제외):', MAIN_DB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://***:***@'));

// 향상된 mongoose 연결 옵션
mongoose.connect(MAIN_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000, // 서버 선택 타임아웃
  socketTimeoutMS: 45000, // 소켓 타임아웃
})
  .then(() => {
    console.log('MongoDB 연결 성공');
  })
  .catch(err => {
    console.error('MongoDB 연결 실패:', err.message);
    // 연결 실패 시에도 서버는 계속 실행
    console.log('MongoDB 연결 없이 서버 시작...');
  });

// 연결 에러 이벤트 처리
mongoose.connection.on('error', (err) => {
  console.error('MongoDB 연결 에러 발생:', err.message);
});

// 재연결 이벤트 처리
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB에 재연결되었습니다.');
});

// 사용자 스키마
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// 테스트 사용자 생성 함수
async function createTestUser() {
  try {
    // mongoose 연결 확인
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB 연결이 준비되지 않아 테스트 사용자 생성을 건너뜁니다.');
      return;
    }

    console.log('테스트 사용자 확인 중...');
    // 기존 테스트 사용자가 있는지 확인
    const existingUser = await User.findOne({ username: 'test' });
    
    if (existingUser) {
      console.log('테스트 사용자가 이미 존재합니다.');
      return;
    }
    
    console.log('테스트 사용자 생성 시작...');
    // 새 테스트 사용자 생성
    const testUser = new User({
      username: 'test',
      password: '1234'
    });
    
    await testUser.save();
    console.log('테스트 사용자가 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('테스트 사용자 생성 중 오류 발생:', error.message);
    console.error('오류 상세:', error.stack);
  }
}

// MongoDB 연결 성공 시 테스트 사용자 생성 실행 - 약간의 지연을 두어 안정성 확보
mongoose.connection.once('open', () => {
  console.log('MongoDB 연결이 열렸습니다. 5초 후 테스트 사용자를 확인합니다.');
  setTimeout(createTestUser, 5000);
});

// 폴더 스키마
const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  createdAt: { type: Date, default: Date.now }
});

const Folder = mongoose.model('Folder', folderSchema);

// 스코어 데이터 스키마
const scoreSchema = new mongoose.Schema({
  tournamentName: { type: String, required: true },
  courseColumns: { type: [String], required: true },
  division: { type: String, default: '일반부' },
  rows: {
    type: [{
      group: { type: String, default: '' },
      order: { type: String, default: '' },
      name: { type: String, default: '' },
      region: { type: String, default: '' },
      startCourse: { type: String, default: '' },
      courses: { type: mongoose.Schema.Types.Mixed, default: {} },
      total: { type: Number, default: 0 }
    }],
    required: true,
    default: []
  },
  totalDays: { type: Number, required: true, min: 1 },
  parData: { type: mongoose.Schema.Types.Mixed, default: {} },
  additionalTitle: { type: String, default: '' },
  folderId: { type: mongoose.Schema.Types.ObjectId, default: null },
  createdAt: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// API 엔드포인트
app.post('/api/scores', async (req, res) => {
  try {
    console.log('서버에서 받은 데이터:', req.body);
    
    // 필수 필드 검증
    if (!req.body.tournamentName) {
      return res.status(400).json({ message: '대회 이름은 필수입니다.' });
    }
    if (!Array.isArray(req.body.courseColumns) || req.body.courseColumns.length === 0) {
      return res.status(400).json({ message: '코스 정보는 필수입니다.' });
    }
    if (!Array.isArray(req.body.rows)) {
      return res.status(400).json({ message: '선수 데이터 형식이 올바르지 않습니다.' });
    }
    if (!req.body.totalDays || req.body.totalDays < 1) {
      return res.status(400).json({ message: '대회 일수는 1 이상이어야 합니다.' });
    }

    // folderId 처리
    const data = { ...req.body };
    if (data.folderId) {
      try {
        data.folderId = new mongoose.Types.ObjectId(data.folderId);
      } catch (error) {
        data.folderId = null;
      }
    } else {
      data.folderId = null;
    }
    
    const newScore = new Score(data);
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    console.error('저장 에러:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: '데이터 형식이 올바르지 않습니다.',
        error: error.message 
      });
    }
    res.status(400).json({ 
      message: '데이터 저장 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

app.get('/api/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ createdAt: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 대회 목록 가져오기 API
app.get('/api/tournaments', async (req, res) => {
  try {
    const { folderId } = req.query;
    let query = {};
    
    // home이거나 null인 경우 루트 폴더의 대회만 반환
    if (folderId === "home" || folderId === "null") {
      query = { folderId: null };
    } 
    // 특정 폴더의 대회를 반환
    else if (folderId) {
      try {
        const folderObjectId = new mongoose.Types.ObjectId(folderId);
        query = { folderId: folderObjectId };
      } catch (err) {
        return res.status(400).json({ message: '잘못된 폴더 ID 형식입니다.' });
      }
    }
    // folderId가 제공되지 않은 경우 빈 배열 반환
    else {
      return res.json([]);
    }

    const tournaments = await Score.find(query, 'tournamentName division additionalTitle createdAt folderId')
      .sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (error) {
    console.error('대회 목록 조회 에러:', error);
    res.status(500).json({ message: error.message });
  }
});

// 특정 대회 데이터 가져오기
app.get('/api/scores/:id', async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({ message: '대회를 찾을 수 없습니다.' });
    }
    res.json(score);
  } catch (error) {
    console.error('조회 에러:', error);
    res.status(500).json({ 
      message: '대회 데이터 조회 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// 특정 대회 데이터 덮어쓰기
app.put('/api/scores/:id', async (req, res) => {
  // 트랜잭션 시작
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('서버에서 받은 업데이트 데이터:', req.body);
    
    // 필수 필드 검증
    if (!req.body.tournamentName) {
      throw new Error('대회 이름은 필수입니다.');
    }
    if (!Array.isArray(req.body.courseColumns) || req.body.courseColumns.length === 0) {
      throw new Error('코스 정보는 필수입니다.');
    }
    if (!Array.isArray(req.body.rows)) {
      throw new Error('선수 데이터 형식이 올바르지 않습니다.');
    }
    if (!req.body.totalDays || req.body.totalDays < 1) {
      throw new Error('대회 일수는 1 이상이어야 합니다.');
    }
    
    const score = await Score.findById(req.params.id).session(session);
    if (!score) {
      throw new Error('대회를 찾을 수 없습니다.');
    }

    Object.assign(score, { ...req.body, createdAt: new Date() });
    await score.save({ session });
    
    // 트랜잭션 커밋
    await session.commitTransaction();
    res.json(score);
  } catch (error) {
    // 에러 발생 시 롤백
    await session.abortTransaction();
    console.error('업데이트 에러:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: '데이터 형식이 올바르지 않습니다.',
        error: error.message 
      });
    }
    res.status(error.message.includes('찾을 수 없습니다') ? 404 : 500).json({ 
      message: error.message || '대회 데이터 업데이트 중 오류가 발생했습니다.'
    });
  } finally {
    session.endSession();
  }
});

// 특정 대회 삭제
app.delete('/api/scores/:id', async (req, res) => {
  try {
    const deletedScore = await Score.findByIdAndDelete(req.params.id);
    if (!deletedScore) {
      return res.status(404).json({ message: '대회를 찾을 수 없습니다.' });
    }
    res.json({ message: '대회가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 폴더 생성
app.post('/api/folders', async (req, res) => {
  try {
    const { name, parentId } = req.body;
    if (!name) {
      return res.status(400).json({ message: '폴더 이름은 필수입니다.' });
    }
    
    const newFolder = new Folder({ name, parentId });
    await newFolder.save();
    res.status(201).json(newFolder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 폴더 목록 조회
app.get('/api/folders', async (req, res) => {
  try {
    const folders = await Folder.find().sort({ createdAt: 1 });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 폴더 삭제 (하위 폴더와 대회도 함께 삭제)
app.delete('/api/folders/:id', async (req, res) => {
  // 트랜잭션 시작
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const folderId = req.params.id;
    
    // 재귀적으로 하위 폴더 ID들을 수집하는 함수
    async function getSubFolderIds(parentId) {
      const folders = await Folder.find({ parentId }).session(session);
      let ids = [parentId];
      for (const folder of folders) {
        ids = [...ids, ...(await getSubFolderIds(folder._id))];
      }
      return ids;
    }
    
    // 삭제할 모든 폴더 ID 수집
    const folderIds = await getSubFolderIds(folderId);
    
    // 해당 폴더들에 속한 대회들 삭제
    await Score.deleteMany({ folderId: { $in: folderIds } }).session(session);
    
    // 폴더들 삭제
    await Folder.deleteMany({ _id: { $in: folderIds } }).session(session);
    
    // 트랜잭션 커밋
    await session.commitTransaction();
    res.json({ message: '폴더가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    // 에러 발생 시 롤백
    await session.abortTransaction();
    console.error('폴더 삭제 에러:', error);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// 대회 이동
app.put('/api/scores/:id/move', async (req, res) => {
  // 트랜잭션 시작
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { folderId } = req.body;
    
    // 이동할 대회가 존재하는지 확인
    const score = await Score.findById(req.params.id).session(session);
    if (!score) {
      throw new Error('대회를 찾을 수 없습니다.');
    }

    // 대상 폴더가 존재하는지 확인 (루트로 이동하는 경우 제외)
    if (folderId) {
      const targetFolder = await Folder.findById(folderId).session(session);
      if (!targetFolder) {
        throw new Error('대상 폴더를 찾을 수 없습니다.');
      }
    }

    // 대회 이동 (folderId 업데이트)
    const updatedScore = await Score.findByIdAndUpdate(
      req.params.id,
      { folderId: folderId || null },
      { new: true, session }
    );

    // 트랜잭션 커밋
    await session.commitTransaction();
    res.json(updatedScore);
  } catch (error) {
    // 에러 발생 시 롤백
    await session.abortTransaction();
    console.error('대회 이동 에러:', error);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// 폴더 이름 변경
app.put('/api/folders/:id', async (req, res) => {
  // 트랜잭션 시작
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name } = req.body;
    if (!name) {
      throw new Error('폴더 이름은 필수입니다.');
    }
    
    const folder = await Folder.findById(req.params.id).session(session);
    if (!folder) {
      throw new Error('폴더를 찾을 수 없습니다.');
    }

    folder.name = name;
    await folder.save({ session });
    
    // 트랜잭션 커밋
    await session.commitTransaction();
    res.json(folder);
  } catch (error) {
    // 에러 발생 시 롤백
    await session.abortTransaction();
    console.error('폴더 이름 변경 에러:', error);
    res.status(error.message.includes('찾을 수 없습니다') ? 404 : 500).json({ 
      message: error.message || '폴더 이름 변경 중 오류가 발생했습니다.'
    });
  } finally {
    session.endSession();
  }
});

// 인증 API 엔드포인트
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '아이디와 비밀번호를 모두 입력해주세요.' });
    }
    
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
    
    res.status(200).json({ success: true, message: '로그인 성공', user: { username: user.username } });
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 사용자 등록 API 엔드포인트 (관리 목적)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: '아이디와 비밀번호를 모두 입력해주세요.' });
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '이미 사용 중인 아이디입니다.' });
    }
    
    const newUser = new User({ username, password });
    await newUser.save();
    
    res.status(201).json({ success: true, message: '사용자가 등록되었습니다.', user: { username: newUser.username } });
  } catch (error) {
    console.error('사용자 등록 에러:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

// 예상치 못한 오류 처리
process.on('uncaughtException', (error) => {
  console.error('예상치 못한 예외 발생:', error.message);
  console.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('처리되지 않은 Promise 거부:', reason);
});
// 정상적인 종료 처리
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('서버 종료 중...');
  server.close(() => {
    console.log('서버가 종료되었습니다.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB 연결이 종료되었습니다.');
      process.exit(0);
    });
  });
  
  // 강제 종료 타임아웃 설정 (10초 후 강제 종료)
  setTimeout(() => {
    console.error('서버가 10초 내에 정상 종료되지 않아 강제 종료합니다.');
    process.exit(1);
  }, 10000);
}
