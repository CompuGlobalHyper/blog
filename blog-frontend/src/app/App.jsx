import { useState, useEffect } from 'react'
import './App.css'
import { Link, Outlet } from 'react-router'

const sayHello = () => {
    return console.log('Hello World')
  }



function App() {
  const [viewUnpublished, setviewUnpublished] = useState(false);
  useEffect(() => {
    sayHello()}, [])

  const setBlogView = (boolean) => {
    setviewUnpublished(!boolean)
}

  return (
    <>
      <Outlet context={( sayHello )}></Outlet>
    </>
  )
}

export default App
