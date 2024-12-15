import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Teacher from './Stores/teacher.ts';
import DisciplanaryTopics from './Stores/disciplinaryTopics.ts';

const teacher = new Teacher();
const disciplanaryTopics = new DisciplanaryTopics();

export const GlobalData = createContext<{
  teacher: Teacher,
  disciplanaryTopics: DisciplanaryTopics
}>
  ({
    teacher,
    disciplanaryTopics
  })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
