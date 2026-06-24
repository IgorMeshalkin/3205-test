import { Navigate, Route, Routes } from 'react-router-dom'
import './App.scss'
import { AppLayout } from './layouts/AppLayout'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/*<Route index element={<HomePage />} />*/}
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}

export default App
