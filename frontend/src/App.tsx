import { useState, useEffect, useMemo } from 'react';
import { NavBar } from './components/NavBar';
import { ExerciseSection } from './components/ExerciseSection';
import { ToastContainer } from './components/ToastContainer';
import { FloatingSearchButton } from './components/FloatingSearchButtom';
import { useToast } from './hooks/useToast';
import { useExercises } from './hooks/useExercises';

export const App = () => {
  const { toasts, addToast, removeToast } = useToast();
  const { exercises, loading } = useExercises();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('search-navbar');
      if (navbar) {
        const rect = navbar.getBoundingClientRect();
        setShowFloatingButton(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSearch = () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
    }
  };

  if (loading && exercises.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ejercicios...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        exercises={exercises}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-white to-white">
        <ExerciseSection searchTerm={searchTerm} addToast={addToast} />
        <FloatingSearchButton show={showFloatingButton} onClick={scrollToSearch} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </>
  );
}

export default App;