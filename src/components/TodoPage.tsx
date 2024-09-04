/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
import { Check, Delete, Undo } from '@mui/icons-material';

import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [ tasks, setTasks ] = useState<Task[]>([]);
  const [ isAdding, setIsAdding ] = useState(false);
  const [ newTaskName, setNewTaskName ] = useState<string>('');

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
    // @todo IMPLEMENT HERE : DELETE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
  };

  const handleSave = async () => {
    // @todo IMPLEMENT HERE : SAVE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
    if (newTaskName) {
      await api.post('/tasks', { name: newTaskName });
      setNewTaskName('');
      setIsAdding(false);
      handleFetchTasks();
    }
  };

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
              <TextField size="small" key={task.id} value={task.name} onChange={(e) => setNewTaskName(e.target.value)} fullWidth sx={{ maxWidth: 350 }} />
              <Box>
                <IconButton color="success" disabled>
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => {}}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        }

        {isAdding ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <TextField size="small" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} fullWidth sx={{ maxWidth: 350 }} />
            <IconButton color="success" title="Sauvegarder" onClick={handleSave}>

              <Check />
            </IconButton>
            <IconButton color="info" title="Annuler" onClick={() => setIsAdding(false)}>
              <Undo />
            </IconButton>
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Button variant="outlined" onClick={() => setIsAdding(true)}>Ajouter une tâche</Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default TodoPage;
