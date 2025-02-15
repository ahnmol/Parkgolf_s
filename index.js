const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
require('./backup/dbBackup');
console.log('백업 시스템 초기화 완료: 백업 스케줄러가 등록되었습니다.');

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkgolf';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

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
    
    const newScore = new Score(req.body);
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
    const query = folderId ? { folderId } : {};
    const tournaments = await Score.find(query, 'tournamentName division additionalTitle createdAt folderId')
      .sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (error) {
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
  try {
    console.log('서버에서 받은 업데이트 데이터:', req.body);
    
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
    
    const updatedScore = await Score.findByIdAndUpdate(
      req.params.id,
      { ...req.body, createdAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedScore) {
      return res.status(404).json({ message: '대회를 찾을 수 없습니다.' });
    }
    res.json(updatedScore);
  } catch (error) {
    console.error('업데이트 에러:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: '데이터 형식이 올바르지 않습니다.',
        error: error.message 
      });
    }
    res.status(500).json({ 
      message: '대회 데이터 업데이트 중 오류가 발생했습니다.',
      error: error.message 
    });
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
  try {
    const folderId = req.params.id;
    
    // 재귀적으로 하위 폴더 ID들을 수집하는 함수
    async function getSubFolderIds(parentId) {
      const folders = await Folder.find({ parentId });
      let ids = [parentId];
      for (const folder of folders) {
        ids = [...ids, ...(await getSubFolderIds(folder._id))];
      }
      return ids;
    }
    
    // 삭제할 모든 폴더 ID 수집
    const folderIds = await getSubFolderIds(folderId);
    
    // 해당 폴더들에 속한 대회들 삭제
    await Score.deleteMany({ folderId: { $in: folderIds } });
    
    // 폴더들 삭제
    await Folder.deleteMany({ _id: { $in: folderIds } });
    
    res.json({ message: '폴더가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 대회 이동
app.put('/api/scores/:id/move', async (req, res) => {
  try {
    const { folderId } = req.body;
    const updatedScore = await Score.findByIdAndUpdate(
      req.params.id,
      { folderId },
      { new: true }
    );
    if (!updatedScore) {
      return res.status(404).json({ message: '대회를 찾을 수 없습니다.' });
    }
    res.json(updatedScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 폴더 이름 변경
app.put('/api/folders/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: '폴더 이름은 필수입니다.' });
    }
    
    const updatedFolder = await Folder.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    
    if (!updatedFolder) {
      return res.status(404).json({ message: '폴더를 찾을 수 없습니다.' });
    }
    
    res.json(updatedFolder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});