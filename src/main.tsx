import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Teacher from './Stores/teacher.ts';

const teacher = new Teacher();

export const GlobalData = createContext<{
  teacher: Teacher
}>
  ({
    teacher,
  })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
