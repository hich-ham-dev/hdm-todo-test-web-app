import {
  Check,
  Delete,
  Undo,
} from '@mui/icons-material';

import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [ tasks, setTasks ] = useState<Task[]>([]);
  const [ isAdding, setIsAdding ] = useState(false);
  const [ newTaskName, setNewTaskName ] = useState<string>('');
  const [ editingTask, setEditingTask ] = useState<Task | null>(null);

  // Fetch tasks
  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  // Delete task
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`, { name: newTaskName });
      handleFetchTasks();
      toast.success('Tâche supprimée avec succès');
    } catch (error) {
      toast.error('Une erreur est survenue lors de la suppression de la tâche');
    }
  };

  // Save new task
  const handleSave = async () => {
    if (!newTaskName.trim()) {
      toast.error('Le nom de la tâche ne peut pas être vide');
      return;
    }

    try {
      // Api call to save new task
      await api.post('/tasks', { name: newTaskName });
      setNewTaskName('');
      setIsAdding(false);
      handleFetchTasks();
      toast.success('Tâche ajoutée avec succès');
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'ajout de la tâche');
    }
  };

  // Update task
  const handleUpdate = async () => {
    if (editingTask) {
      if (!editingTask.name.trim()) {
        toast.error('Le nom de la tâche ne peut pas être vide');
        return;
      }

      try {
        const task = tasks.find((t) => t.id === editingTask.id);
        if (task && task.name === editingTask.name) {
          toast.info('Le nom de la tâche n\'a pas changé');
          return;
        }

        await api.patch(`/tasks/${editingTask.id}`, { name: editingTask.name });
        setEditingTask(null);
        handleFetchTasks();
        toast.success('Tâche mise à jour avec succès');
      } catch (error) {
        toast.error('Une erreur est survenue lors de la mise à jour de la tâche');
      }
    }
  };

  useEffect(() => {
    handleFetchTasks();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {/* Display all tasks stored in database */}
        {tasks.map((task) => (
          <Box
            key={task.id}
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
            gap={1}
            width="100%"
          >
            {/*  */}
            {editingTask && editingTask.id === task.id ? (
              // Display textfield to edit task name and save/cancel buttons
              <>
                <TextField
                  size="small"
                  value={editingTask.name}
                  onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                  fullWidth
                  sx={{ maxWidth: 350 }}
                />
                <Box>
                  <IconButton color="success" onClick={handleUpdate}>
                    <Check />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => setEditingTask(null)}
                  >
                    <Undo />
                  </IconButton>
                </Box>
              </>
            ) : (
              // Display task name and delete button without textfield
              <>
                <Typography
                  variant="body1"
                  sx={{ maxWidth: 350, textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => setEditingTask(task)}
                >
                  {task.name}
                </Typography>
                <Box>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        ))}
      </Box>

      {/* Display TextField to create a new task and hide the add new task button */}
      {isAdding && !editingTask && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <TextField
            size="small"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            fullWidth
            sx={{ maxWidth: 350 }}
          />
          <IconButton color="success" title="Sauvegarder" onClick={handleSave}>
            <Check />
          </IconButton>
          <IconButton color="secondary" title="Annuler" onClick={() => setIsAdding(false)}>
            <Undo />
          </IconButton>
        </Box>
      )}

      {/* Show add new task button */}
      {!isAdding && !editingTask && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button variant="outlined" onClick={() => setIsAdding(true)}>Ajouter une tâche</Button>
        </Box>
      )}
    </Container>
  );
};

export default TodoPage;

