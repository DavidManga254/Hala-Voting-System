import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { Homepage } from './pages/homepage';
import { VotePage } from './pages/votepage';
import { TickScreen } from './pages/tick';
import { Results } from './pages/results';

const router =  createBrowserRouter([
  {
    path:'/',
    element:<Homepage/>
  },
  {
    path:'vote',
    element:<VotePage/>
  },
  {
    path:'verified',
    element:<TickScreen/>
  },
  {
    path:'results',
    element:<Results/>
  }
])


function App() {

  return (
    <RouterProvider router={router}/>
    
  )
}

export default App
