import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import '/fonts/SFCompact/SF-Compact-Text-Light.ttf';

import '/fonts/SFCompact/SF-Compact-Text-Medium.ttf';

import '/fonts/SFCompact/SF-Compact-Text-Semibold.ttf';

import '/fonts/SFCompact/SF-Compact-Text-Thin.ttf';

// import studio from '@theatre/studio'
// import extension from '@theatre/r3f/dist/extension'

// studio.extend(extension);
// studio.initialize();


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
