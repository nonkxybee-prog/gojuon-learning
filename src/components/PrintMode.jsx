import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Printer, Download, Shuffle } from 'lucide-react'
import gojuonData from '../assets/gojuon_data.json'

const PrintMode = () => {
  const [printMode, setPrintMode] = useState('hiragana-to-romaji')
  const [printRange, setPrintRange] = useState('all')
  const [questionCount, setQuestionCount] = useState(20)
  const [showAnswers, setShowAnswers] = useState(false)
  const [randomOrder, setRandomOrder] = useState(true)
  const [generatedQuestions, setGeneratedQuestions] = useState([])

  // 练习模式选项
  const printModes = [
    { value: 'hiragana-to-romaji', label: '平假名 → 罗马音' },
    { value: 'katakana-to-romaji', label: '片假名 → 罗马音' },
    { value: 'romaji-to-hiragana', label: '罗马音 → 平假名' },
    { value: 'romaji-to-katakana', label: '罗马音 → 片假名' },
    { value: 'hiragana-to-katakana', label: '平假名 → 片假名' },
    { value: 'katakana-to-hiragana', label: '片假名 → 平假名' }
  ]

  // 练习范围选项
  const printRanges = [
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

  // 生成题目
  const generateQuestions = () => {
    let pool = []
    
    gojuonData.gojuon.forEach(row => {
      if (printRange === 'all' || row.row === printRange) {
        row.sounds.forEach(sound => {
          if (sound.hiragana && sound.katakana && sound.romaji) {
            pool.push(sound)
          }
        })
      }
    })

    // 随机打乱或保持顺序
    if (randomOrder) {
      pool = pool.sort(() => Math.random() - 0.5)
    }

    // 限制题目数量
    const questions = pool.slice(0, Math.min(questionCount, pool.length))
    setGeneratedQuestions(questions)
  }

  // 获取题目文本
  const getQuestionText = (question) => {
    const [from] = printMode.split('-to-')
    return question[from === 'romaji' ? 'romaji' : from]
  }

  // 获取答案文本
  const getAnswerText = (question) => {
    const [, to] = printMode.split('-to-')
    return question[to === 'romaji' ? 'romaji' : to]
  }

  // 打印功能
  const handlePrint = () => {
    if (generatedQuestions.length === 0) {
      generateQuestions()
      return
    }

    const printWindow = window.open('', '_blank')
    const modeLabel = printModes.find(m => m.value === printMode)?.label || ''
    const rangeLabel = printRanges.find(r => r.value === printRange)?.label || ''
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>五十音图默写练习</title>
          <style>
            body {
              font-family: 'Microsoft YaHei', Arial, sans-serif;
              margin: 20px;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .info {
              margin-bottom: 20px;
              background: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
            }
            .questions {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            .question-item {
              border: 1px solid #ddd;
              padding: 15px;
              border-radius: 5px;
              text-align: center;
            }
            .question-text {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .answer-line {
              border-bottom: 2px solid #333;
              height: 30px;
              margin: 10px 0;
            }
            .answer-text {
              font-size: 18px;
              color: #666;
              margin-top: 10px;
            }
            .answers-section {
              page-break-before: always;
              margin-top: 50px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>五十音图默写练习</h1>
            <p>练习模式: ${modeLabel} | 练习范围: ${rangeLabel}</p>
          </div>
          
          <div class="info">
            <p><strong>题目数量:</strong> ${generatedQuestions.length}</p>
            <p><strong>生成时间:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>说明:</strong> 请在横线上写出对应的答案</p>
          </div>

          <div class="questions">
            ${generatedQuestions.map((question, index) => `
              <div class="question-item">
                <div><strong>${index + 1}.</strong></div>
                <div class="question-text">${getQuestionText(question)}</div>
                <div class="answer-line"></div>
                ${showAnswers ? `<div class="answer-text">答案: ${getAnswerText(question)}</div>` : ''}
              </div>
            `).join('')}
          </div>

          ${showAnswers ? '' : `
            <div class="answers-section">
              <h2>参考答案</h2>
              <div class="questions">
                ${generatedQuestions.map((question, index) => `
                  <div class="question-item">
                    <div><strong>${index + 1}.</strong> ${getQuestionText(question)}</div>
                    <div class="answer-text">${getAnswerText(question)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `}
        </body>
      </html>
    `
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    
    // 延迟打印，确保内容加载完成
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  // 自动生成题目
  useEffect(() => {
    generateQuestions()
  }, [printMode, printRange, questionCount, randomOrder])

  return (
    <div className="space-y-6">
      {/* 设置区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">练习模式</label>
          <Select value={printMode} onValueChange={setPrintMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {printModes.map(mode => (
                <SelectItem key={mode.value} value={mode.value}>
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">练习范围</label>
          <Select value={printRange} onValueChange={setPrintRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {printRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">题目数量</label>
          <Input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
            min="1"
            max="50"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="randomOrder"
              checked={randomOrder}
              onCheckedChange={setRandomOrder}
            />
            <label htmlFor="randomOrder" className="text-sm font-medium">
              随机排列题目
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showAnswers"
              checked={showAnswers}
              onCheckedChange={setShowAnswers}
            />
            <label htmlFor="showAnswers" className="text-sm font-medium">
              在题目下方显示答案
            </label>
          </div>
        </div>
      </div>

      {/* 预览区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>练习预览</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={generateQuestions}>
                <Shuffle className="w-4 h-4 mr-2" />
                重新生成
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                打印练习
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {generatedQuestions.length > 0 ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                <p>练习模式: {printModes.find(m => m.value === printMode)?.label}</p>
                <p>练习范围: {printRanges.find(r => r.value === printRange)?.label}</p>
                <p>题目数量: {generatedQuestions.length}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
                {generatedQuestions.slice(0, 12).map((question, index) => (
                  <div key={index} className="border rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">{index + 1}.</div>
                    <div className="text-xl font-bold mb-2">
                      {getQuestionText(question)}
                    </div>
                    <div className="border-b-2 border-gray-300 h-6 mb-2"></div>
                    {showAnswers && (
                      <div className="text-sm text-gray-600">
                        {getAnswerText(question)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {generatedQuestions.length > 12 && (
                <div className="text-center text-sm text-gray-500">
                  还有 {generatedQuestions.length - 12} 道题目...
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              请选择练习设置后生成题目
            </div>
          )}
        </CardContent>
      </Card>

      {/* 使用说明 */}
      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">使用说明:</h4>
        <ul className="space-y-1">
          <li>• 选择练习模式和范围后，系统会自动生成题目</li>
          <li>• 可以选择是否随机排列题目顺序</li>
          <li>• 可以选择是否在题目下方显示答案</li>
          <li>• 点击"打印练习"会打开新窗口，可以直接打印或保存为PDF</li>
          <li>• 如果不显示答案，打印版本会在最后附上参考答案</li>
        </ul>
      </div>
    </div>
  )
}

export default PrintMode

