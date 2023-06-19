import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateAccountPage, LoginPage, MainPage, ProjectsPage, SharePage } from './pages';

import App from './App';
import ProjectProvider from 'context/ProjectContextProvider';
import UserProvider from 'context/UserContextProvider';
import axios from 'axios';
import { createRoot } from 'react-dom/client';

axios.defaults.withCredentials = true;
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter basename={'/'}>
    <UserProvider>
      <ProjectProvider>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/create-account' element={<CreateAccountPage />} />
          <Route path='/share/:token' element={<SharePage />} />
          <Route path='/' element={<App />}>
            <Route path='' element={<ProjectsPage />} />
            <Route path='/:projectId' element={<MainPage />} />
          </Route>
        </Routes>
      </ProjectProvider>
    </UserProvider>
  </BrowserRouter>
);
