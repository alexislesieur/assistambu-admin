import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import ShiftsPage from './pages/ShiftsPage'
import InterventionsPage from './pages/InterventionsPage'
import SacPage from './pages/SacPage'
import HospitalsPage from './pages/HospitalsPage'
import WaitlistPage from './pages/WaitlistPage'

export default function App() {
  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/"              element={<DashboardPage />} />
          <Route path="/users"         element={<UsersPage />} />
          <Route path="/shifts"        element={<ShiftsPage />} />
          <Route path="/interventions" element={<InterventionsPage />} />
          <Route path="/sac"           element={<SacPage />} />
          <Route path="/hospitals"     element={<HospitalsPage />} />
          <Route path="/waitlist"      element={<WaitlistPage />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  )
}