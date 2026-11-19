import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components'
import { Contact, Home, Location, NotFound, ProjectDetail, Projects, Team } from './pages'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="team" element={<Team />} />
          <Route path="studio" element={<Navigate to="/team" replace />} />
          <Route path="location" element={<Location />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
