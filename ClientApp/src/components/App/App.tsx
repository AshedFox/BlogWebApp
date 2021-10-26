import React from 'react';
import {BrowserRouter} from "react-router-dom";
import styles from "./App.module.css"
import AppRouter from "../AppRouter/AppRouter";

function App() {
  return (
      <div className={styles.app}>
          <BrowserRouter>
              <AppRouter/>
          </BrowserRouter>
      </div>
  );
}

export default App;
