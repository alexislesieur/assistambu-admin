import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import ShiftsPage from './pages/ShiftsPage'
import InterventionsPage from './pages/InterventionsPage'
import SacPage from './pages/SacPage'
import WaitlistPage from './pages/WaitlistPage'
import LogsPage from './pages/LogsPage'
import HospitalsPage from './pages/HospitalsPage'
import ArticlesPage from './pages/ArticlesPage'
import ItemCategoriesPage from './pages/ItemCategoriesPage'
import IntervCategoriesPage from './pages/IntervCategoriesPage'

export default function App() {
  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/"                           element={<DashboardPage />} />
          <Route path="/users"                      element={<UsersPage />} />
          <Route path="/shifts"                     element={<ShiftsPage />} />
          <Route path="/interventions"              element={<InterventionsPage />} />
          <Route path="/sac"                        element={<SacPage />} />
          <Route path="/waitlist"                   element={<WaitlistPage />} />
          <Route path="/logs"                       element={<LogsPage />} />
          <Route path="/config/hopitaux"            element={<HospitalsPage />} />
          <Route path="/config/articles"            element={<ArticlesPage />} />
          <Route path="/config/categories-sac"      element={<ItemCategoriesPage />} />
          <Route path="/config/categories-interv"   element={<IntervCategoriesPage />} />
          <Route path="*"                           element={<Navigate to="/" />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  )
}