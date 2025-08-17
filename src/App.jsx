import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Volume2, BookOpen, Printer } from 'lucide-react'
import GojuonTable from './components/GojuonTable'
import PracticeMode from './components/PracticeMode'
import PrintMode from './components/PrintMode'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('table')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            日本五十音图学习网站
          </h1>
          <p className="text-lg text-gray-600">
            学习平假名、片假名和罗马音，掌握日语基础
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              五十音图
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              默写练习
            </TabsTrigger>
            <TabsTrigger value="print" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              打印练习
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  五十音图表
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GojuonTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practice">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  默写练习
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PracticeMode />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="print">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Printer className="w-5 h-5" />
                  打印练习
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PrintMode />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
