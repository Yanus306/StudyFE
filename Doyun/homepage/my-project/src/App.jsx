import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeIndex from './page/home/index';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<HomeIndex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;