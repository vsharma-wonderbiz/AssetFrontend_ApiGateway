import React from 'react'
import Menu from "./Components/menu.jsx"
import { ToastContainer } from 'react-toastify'
import menu1 from './Components/Menu1.jsx'
import Menu1 from './Components/Menu1.jsx'
import ContextMenu from './Components/ContextMeus.jsx'
import FullPageOverlay from './Components/FullPageOverlay.jsx'
import { Signal } from 'lucide-react'
import SignalOverlay from './Components/SignalOverlay.jsx'

const App = () => {
  const [showOverlay, setShowOverlay] = React.useState(false);
  return (
     <>
      {/* <Menu></Menu> */}
      <Menu1/>
      {/* <SignalOverlay/> */}
      <ToastContainer></ToastContainer>

     </>
  )
}

export default App



