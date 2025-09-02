import React from 'react'
import Menu from "./Components/menu.jsx"
import { ToastContainer } from 'react-toastify'
// import menu1 from './Components/Menu1.jsx'
import Menu1 from './Components/menu1.jsx'
import ContextMenu from './Components/ContextMeus.jsx'
import FullPageOverlay from './Components/FullPageOverlay.jsx'

import SignalOverlay from './Components/SignalOverlay.jsx'
import SignalsTable from './Components/SignalsTable.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from './Components/AuthFrom.jsx'

const App = () => {

  return (
     <>
      {/* <Menu></Menu> */}
      {/* <Menu1/> */}
      
      
      <Router>
          <ToastContainer></ToastContainer>

          <Routes>
            <Route path="/"  element={<Menu1/>}></Route>
            <Route path="/display-signals"  element={<SignalsTable/>}></Route>
            <Route path="/Register" element={<AuthForm/>}></Route>
          </Routes>
      </Router>

     </>
  )
}

export default App



