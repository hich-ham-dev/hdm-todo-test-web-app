import { createHashRouter } from 'react-router-dom';
import TodoPage from '../pages/TodoPage.tsx';
import CategoriesPage from '../pages/CategoriesPage.tsx';

const router = createHashRouter([
  {
    path: '/',
    element: <TodoPage />,
  },
]);

export default router;
