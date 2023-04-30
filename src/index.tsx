import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateAccountPage, LoginPage, MainPage, ProjectsPage } from './pages';
import App from './App';
import UserProvider from 'context/UserContextProvider';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter basename={'/'}>
    <UserProvider>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/create-account' element={<CreateAccountPage />} />
        <Route path='/' element={<App />}>
          <Route path='' element={<ProjectsPage />} />
          <Route path='/:projectId' element={<MainPage />} />
        </Route>
      </Routes>
    </UserProvider>
  </BrowserRouter>
);
