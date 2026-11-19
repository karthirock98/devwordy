import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import FxLayer from './components/FxLayer';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import TopicPicker from './components/TopicPicker';
import { usePlayer } from './hooks/PlayerContext';
import styles from './App.module.scss';

export default function App() {
  const location = useLocation();
  const { progress, setTopics } = usePlayer();
  return (
    <>
      <Header />
      <main className={styles.main} key={location.pathname}>
        <Routes>
          <Route path="/" element={<Navigate to="/daily" replace />} />
          <Route path="/daily" element={<GamePage mode="daily" />} />
          <Route path="/unlimited" element={<GamePage mode="unlimited" />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/daily" replace />} />
        </Routes>
      </main>
      <footer className={styles.footer}>
        <span className="mono">DevWordy</span> · guess the concept · progress saved on this device
      </footer>
      <FxLayer />
      {progress.topics === null && <TopicPicker initial={null} onboarding onSave={setTopics} />}
    </>
  );
}
