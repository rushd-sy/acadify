import { Routes, Route } from 'react-router-dom';
import StudentsPage from '@/pages/students-page';
import StudentsDetailsPage from '@/pages/students-details-page';
import ErrorPage from './pages/error-page';
import SharedLayout from './layout/SharedLayout';
function App() {
  return (
    <div>
      <Routes>
        <Route path="" element={<SharedLayout />}>
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:id" element={<StudentsDetailsPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
