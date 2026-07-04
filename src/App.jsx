import { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  return <AppRouter />;
}

export default App;
