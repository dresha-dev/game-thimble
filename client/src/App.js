import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('/api/generate-path');
  }, []);
  return <div className="App">Thimble game</div>;
}

export default App;
