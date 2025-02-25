import React from 'react';

import TaskManager from './components/TaskManager';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold">Task Manager</h1>
      </header>

      <TaskManager />
    </div>
  );
}

export default App;
