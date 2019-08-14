import React from 'react';
import ChatController from './js/controller/Chat';
import './css/styles.css';

window.addEventListener('DOMContentLoaded', () => {
  ChatController.start();
});

function App() {
  return (
      <div className="App">
      </div>
  );
}

export default App;
