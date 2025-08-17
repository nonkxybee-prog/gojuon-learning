import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card } from '@/components/ui/card.jsx'
import { Volume2 } from 'lucide-react'
import gojuonData from '../assets/gojuon_data.json'

const GojuonTable = () => {
  const [displayMode, setDisplayMode] = useState('hiragana') // hiragana, katakana, romaji
  const [audioCache, setAudioCache] = useState({})

  // 预加载音频文件
  useEffect(() => {
    const loadAudio = async () => {
      const cache = {}
      
      // 遍历所有假名，预加载音频
        gojuonData.gojuon.forEach(row => {
        row.sounds.forEach(sound => {
          if (sound.romaji) {
            try {
              // 使用相对路径导入音频文件
              import(`../assets/audio_files/${sound.romaji}.wav`).then(audioModule => {
                const audio = new Audio(audioModule.default)
                cache[sound.romaji] = audio
              }).catch(error => {
                console.warn(`Failed to load audio for ${sound.romaji}:`, error)
              })
            } catch (error) {
              console.warn(`Failed to load audio for ${sound.romaji}:`, error)
            }
          }
        })
      })
      
      setAudioCache(cache)
    }

    loadAudio()
  }, [])

  const playSound = (romaji) => {
    if (audioCache[romaji]) {
      audioCache[romaji].currentTime = 0
      audioCache[romaji].play().catch(error => {
        console.warn(`Failed to play audio for ${romaji}:`, error)
      })
    }
  }

  const getDisplayText = (sound) => {
    switch (displayMode) {
      case 'hiragana':
        return sound.hiragana
      case 'katakana':
        return sound.katakana
      case 'romaji':
        return sound.romaji
      default:
        return sound.hiragana
    }
  }

  const columns = ['あ段', 'い段', 'う段', 'え段', 'お段']

  return (
    <div className="space-y-6">
      {/* 显示模式切换 */}
      <div className="flex justify-center gap-2">
        <Button
          variant={displayMode === 'hiragana' ? 'default' : 'outline'}
          onClick={() => setDisplayMode('hiragana')}
        >
          平假名
        </Button>
        <Button
          variant={displayMode === 'katakana' ? 'default' : 'outline'}
          onClick={() => setDisplayMode('katakana')}
        >
          片假名
        </Button>
        <Button
          variant={displayMode === 'romaji' ? 'default' : 'outline'}
          onClick={() => setDisplayMode('romaji')}
        >
          罗马音
        </Button>
      </div>

      {/* 五十音图表格 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border border-gray-300 bg-gray-100 font-semibold">行</th>
              {columns.map((column, index) => (
                <th key={index} className="p-2 border border-gray-300 bg-gray-100 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gojuonData.gojuon.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="p-2 border border-gray-300 bg-gray-50 font-semibold text-center">
                  {row.row}
                </td>
                {row.sounds.map((sound, soundIndex) => (
                  <td key={soundIndex} className="p-2 border border-gray-300 text-center">
                    {sound.hiragana ? (
                      <Card className="p-3 hover:bg-blue-50 transition-colors cursor-pointer min-h-[80px] flex flex-col items-center justify-center">
                        <div
                          className="flex flex-col items-center gap-2"
                          onClick={() => playSound(sound.romaji)}
                        >
                          <div className="text-2xl font-bold text-gray-800">
                            {getDisplayText(sound)}
                          </div>
                          <Volume2 className="w-4 h-4 text-blue-500" />
                          {displayMode !== 'romaji' && (
                            <div className="text-xs text-gray-500">
                              {sound.romaji}
                            </div>
                          )}
                        </div>
                      </Card>
                    ) : (
                      <div className="min-h-[80px]"></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 使用说明 */}
      <div className="text-center text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <p className="flex items-center justify-center gap-2">
          <Volume2 className="w-4 h-4" />
          点击任意假名可以听到发音
        </p>
      </div>
    </div>
  )
}

export default GojuonTable

