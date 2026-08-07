import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { GameScreen } from '@/components/game/game-screen'
import { MainMenu } from '@/components/home/main-menu'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
