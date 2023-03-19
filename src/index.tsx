import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage, MainPage } from './pages';
import App from './App';
import ProtectedRouteWrapper from './util/protected-route-wrapper/ProtectedRouteWrapper';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <BrowserRouter basename={'/'}>
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/' element={<App />}>
        <Route path='' element={
          <ProtectedRouteWrapper>
            <MainPage />
          </ProtectedRouteWrapper>
        } />
      </Route>
    </Routes>
  </BrowserRouter>
);
