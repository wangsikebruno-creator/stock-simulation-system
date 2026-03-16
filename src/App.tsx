import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StockProvider } from './context/StockContext';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';

function App() {
  return (
    <Router>
      <StockProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/detail/:symbol" element={<DetailPage />} />
        </Routes>
      </StockProvider>
    </Router>
  );
}

export default App;
