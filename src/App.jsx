import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreateMeeting from './pages/PizeonflyMeeting'
import ThankYouPage from './pages/ThankYouPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<CreateMeeting />} />
        <Route path='/thank-you' element={<ThankYouPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App