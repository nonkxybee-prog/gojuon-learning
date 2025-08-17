import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CheckCircle, XCircle, RotateCcw, Play } from 'lucide-react'
import gojuonData from '../assets/gojuon_data.json'

const PracticeMode = () => {
  const [practiceMode, setPracticeMode] = useState('hiragana-to-romaji') // 练习模式
  const [practiceRange, setPracticeRange] = useState('all') // 练习范围
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState(null)
  const [questionPool, setQuestionPool] = useState([])
  const [usedQuestions, setUsedQuestions] = useState([])

  // 练习模式选项
  const practiceModes = [
    { value: 'hiragana-to-romaji', label: '平假名 → 罗马音' },
    { value: 'katakana-to-romaji', label: '片假名 → 罗马音' },
    { value: 'romaji-to-hiragana', label: '罗马音 → 平假名' },
    { value: 'romaji-to-katakana', label: '罗马音 → 片假名' },
    { value: 'hiragana-to-katakana', label: '平假名 → 片假名' },
    { value: 'katakana-to-hiragana', label: '片假名 → 平假名' }
  ]

  // 练习范围选项
  const practiceRanges = [
    { value: 'all', label: '全部五十音' },
    { value: 'あ行', label: 'あ行' },
    { value: 'か行', label: 'か行' },
    { value: 'さ行', label: 'さ行' },
    { value: 'た行', label: 'た行' },
    { value: 'な行', label: 'な行' },
    { value: 'は行', label: 'は行' },
    { value: 'ま行', label: 'ま行' },
    { value: 'や行', label: 'や行' },
    { value: 'ら行', label: 'ら行' },
    { value: 'わ行', label: 'わ行' }
  ]

  // 生成题目池
  useEffect(() => {
    const generateQuestionPool = () => {
      let pool = []
      
      gojuonData.gojuon.forEach(row => {
        if (practiceRange === 'all' || row.row === practiceRange) {
          row.sounds.forEach(sound => {
            if (sound.hiragana && sound.katakana && sound.romaji) {
              pool.push(sound)
            }
          })
        }
      })
      
      // 随机打乱题目池
      pool = pool.sort(() => Math.random() - 0.5)
      setQuestionPool(pool)
      setUsedQuestions([])
    }

    generateQuestionPool()
  }, [practiceMode, practiceRange])

  // 生成新题目
  const generateNewQuestion = () => {
    if (questionPool.length === 0) return

    let availableQuestions = questionPool.filter(q => !usedQuestions.includes(q))
    
    // 如果所有题目都用完了，重新开始
    if (availableQuestions.length === 0) {
      availableQuestions = questionPool
      setUsedQuestions([])
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    const question = availableQuestions[randomIndex]
    
    setCurrentQuestion(question)
    setUsedQuestions(prev => [...prev, question])
    setUserAnswer('')
    setFeedback(null)
  }

  // 检查答案
  const checkAnswer = () => {
    if (!currentQuestion || !userAnswer.trim()) return

    const correctAnswer = getCorrectAnswer(currentQuestion)
    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))

    setFeedback({
      isCorrect,
      correctAnswer,
      userAnswer: userAnswer.trim()
    })
  }

  // 获取正确答案
  const getCorrectAnswer = (question) => {
    const [from, to] = practiceMode.split('-to-')
    return question[to === 'romaji' ? 'romaji' : to]
  }

  // 获取题目显示文本
  const getQuestionText = (question) => {
    const [from] = practiceMode.split('-to-')
    return question[from === 'romaji' ? 'romaji' : from]
  }

  // 获取题目类型描述
  const getQuestionTypeLabel = () => {
    const mode = practiceModes.find(m => m.value === practiceMode)
    return mode ? mode.label : ''
  }

  // 重置练习
  const resetPractice = () => {
    setScore({ correct: 0, total: 0 })
    setCurrentQuestion(null)
    setUserAnswer('')
    setFeedback(null)
    setUsedQuestions([])
  }

  // 处理回车键提交
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !feedback) {
      checkAnswer()
    } else if (e.key === 'Enter' && feedback) {
      generateNewQuestion()
    }
  }

  return (
    <div className="space-y-6">
      {/* 设置区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">练习模式</label>
          <Select value={practiceMode} onValueChange={setPracticeMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {practiceModes.map(mode => (
                <SelectItem key={mode.value} value={mode.value}>
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">练习范围</label>
          <Select value={practiceRange} onValueChange={setPracticeRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {practiceRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 分数显示 */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Badge variant="outline" className="text-green-600">
            正确: {score.correct}
          </Badge>
          <Badge variant="outline" className="text-blue-600">
            总计: {score.total}
          </Badge>
          {score.total > 0 && (
            <Badge variant="outline" className="text-purple-600">
              正确率: {Math.round((score.correct / score.total) * 100)}%
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={resetPractice}>
          <RotateCcw className="w-4 h-4 mr-2" />
          重置
        </Button>
      </div>

      {/* 练习区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {getQuestionTypeLabel()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestion ? (
            <>
              {/* 题目显示 */}
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-800 mb-4">
                  {getQuestionText(currentQuestion)}
                </div>
                <p className="text-gray-600">请输入对应的{practiceMode.split('-to-')[1] === 'romaji' ? '罗马音' : practiceMode.split('-to-')[1] === 'hiragana' ? '平假名' : '片假名'}</p>
              </div>

              {/* 答案输入 */}
              <div className="max-w-md mx-auto">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入答案..."
                  className="text-center text-xl"
                  disabled={!!feedback}
                />
              </div>

              {/* 反馈显示 */}
              {feedback && (
                <div className={`text-center p-4 rounded-lg ${feedback.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {feedback.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <span className="font-semibold">
                      {feedback.isCorrect ? '正确！' : '错误'}
                    </span>
                  </div>
                  {!feedback.isCorrect && (
                    <div>
                      <p>你的答案: <span className="font-mono">{feedback.userAnswer}</span></p>
                      <p>正确答案: <span className="font-mono font-semibold">{feedback.correctAnswer}</span></p>
                    </div>
                  )}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex justify-center gap-4">
                {!feedback ? (
                  <Button onClick={checkAnswer} disabled={!userAnswer.trim()}>
                    提交答案
                  </Button>
                ) : (
                  <Button onClick={generateNewQuestion}>
                    <Play className="w-4 h-4 mr-2" />
                    下一题
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Button onClick={generateNewQuestion} size="lg">
                <Play className="w-5 h-5 mr-2" />
                开始练习
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PracticeMode

