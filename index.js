const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkgolf';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

// 백업 디렉토리 생성
const backupDir = path.join(__dirname, 'backups');
fs.ensureDirSync(backupDir);

// 백업 함수
const performBackup = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `backup-${timestamp}`);
  
  // MongoDB URI에서 데이터베이스 이름 추출
  const dbName = MONGODB_URI.split('/').pop();
  
  // mongodump 명령어 실행
  exec(`mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('백업 실패:', error);
      return;
    }
    console.log('백업 성공:', backupPath);
    
    // 30일 이상 된 백업 삭제
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    fs.readdir(backupDir, (err, files) => {
      if (err) {
        console.error('백업 폴더 읽기 실패:', err);
        return;
      }
      
      files.forEach(file => {
        const filePath = path.join(backupDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error('파일 정보 읽기 실패:', err);
            return;
          }
          
          if (stats.mtime < thirtyDaysAgo) {
            fs.remove(filePath, err => {
              if (err) console.error('오래된 백업 삭제 실패:', err);
              else console.log('오래된 백업 삭제:', filePath);
            });
          }
        });
      });
    });
  });
};

// 매일 자정에 백업 실행
cron.schedule('0 0 * * *', () => {
  console.log('일일 백업 시작...');
  performBackup();
});

// 스코어 데이터 스키마
const scoreSchema = new mongoose.Schema({
  tournamentName: String,
  courseColumns: [String],
  rows: [{
    group: String,
    name: String,
    region: String,
    startCourse: String,
    courses: mongoose.Schema.Types.Mixed,
    total: Number
  }],
  totalDays: Number,
  parData: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// API 엔드포인트
app.post('/api/scores', async (req, res) => {
  try {
    const newScore = new Score(req.body);
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    const tournaments = await Score.find({}, 'tournamentName createdAt')
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
    res.status(500).json({ message: error.message });
  }
});

// 특정 대회 데이터 덮어쓰기
app.put('/api/scores/:id', async (req, res) => {
  try {
    const updatedScore = await Score.findByIdAndUpdate(
      req.params.id,
      req.body,
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 