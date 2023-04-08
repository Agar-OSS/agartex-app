import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateAccountPage, LoginPage, MainPage } from './pages';
import App from './App';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter basename={'/'}>
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/create-account' element={<CreateAccountPage />} />
      <Route path='/' element={<App />}>
        <Route path='' element={<MainPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
