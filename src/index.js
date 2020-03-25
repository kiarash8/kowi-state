import React from 'react';
import ReactDOM from "react-dom";
import { StoreProvider } from './store/store';
import App from './app';

function Index() {
    return (
        <StoreProvider>
            <App />
        </StoreProvider>
    );
  }

  ReactDOM.render(
    React.createElement(Index, null),
    document.getElementById('root')
  ); 
