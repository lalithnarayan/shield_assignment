import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { TooltipProvider } from './components/ui/tooltip'
import { createRouter } from './router'

export default function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={createRouter()} />
      <ToastContainer />
    </TooltipProvider>
  )
}
