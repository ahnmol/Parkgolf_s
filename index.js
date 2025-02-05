const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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