/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
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
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from '../hooks/useFetch.ts';
import { Task, Category } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [ tasks, setTasks ] = useState<Task[]>([]);
  const [ categories, setCategories ] = useState<Category[]>([]);
  const [ selectedCategory, setSelectedCategory ] = useState<number | ''>('');
  const [ isAdding, setIsAdding ] = useState(false);
  const [ newTaskName, setNewTaskName ] = useState<string>('');

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

<<<<<<< Updated upstream:src/components/TodoPage.tsx
=======
  // Fetch categories
  const handleFetchCategories = async () => setCategories(await api.get('/categories'));

  // Delete task
>>>>>>> Stashed changes:src/pages/TodoPage.tsx
  const handleDelete = async (id: number) => {
    // @todo IMPLEMENT HERE : DELETE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
    try {
      await api.delete(`/tasks/${id}`, {});
      handleFetchTasks();
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('An error occurred while deleting the task');
    }
  };

  const handleSave = async () => {
    // @todo IMPLEMENT HERE : SAVE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
    if (!newTaskName.trim()) {
      toast.error('The task name cannot be empty');
      return;
    }

    try {
<<<<<<< Updated upstream:src/components/TodoPage.tsx
      await api.post('/tasks', { name: newTaskName });
=======
      // Api call to save new task
      await api.post('/tasks', { name: newTaskName, categoryId: selectedCategory });
>>>>>>> Stashed changes:src/pages/TodoPage.tsx
      setNewTaskName('');
      setSelectedCategory('');
      setIsAdding(false);
      handleFetchTasks();
      toast.success('Task added successfully');
    } catch (error) {
<<<<<<< Updated upstream:src/components/TodoPage.tsx
      toast.error('An error occurred while adding the task');
=======
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

        await api.patch(`/tasks/${editingTask.id}`, { name: editingTask.name, categoryId: selectedCategory });
        setEditingTask(null);
        handleFetchTasks();
        toast.success('Tâche mise à jour avec succès');
      } catch (error) {
        toast.error('Une erreur est survenue lors de la mise à jour de la tâche');
      }
>>>>>>> Stashed changes:src/pages/TodoPage.tsx
    }
  };

  useEffect(() => {
<<<<<<< Updated upstream:src/components/TodoPage.tsx
    (async () => {
      handleFetchTasks();
    })();
=======
    
    handleFetchTasks();
    handleFetchCategories();
>>>>>>> Stashed changes:src/pages/TodoPage.tsx
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
<<<<<<< Updated upstream:src/components/TodoPage.tsx
        {
          tasks.map((task) => (
            <Box key={task.id} display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
              <TextField size="small" value={task.name} onChange={(e) => setNewTaskName(e.target.value)} fullWidth sx={{ maxWidth: 350 }} />
              <Box>
                <IconButton color="success" disabled>
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(task.id)}>
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
            <IconButton color="secondary" title="Annuler" onClick={() => setIsAdding(false)}>
              <Undo />
            </IconButton>
=======
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                      <IconButton 
                        color="success"
                        title="Mettre à jour" 
                        onClick={handleUpdate}>
                        <Check />
                      </IconButton>
                      <IconButton 
                        color="secondary" 
                        title="Annuler" 
                        onClick={() => setEditingTask(null)}>
                        <Undo />
                      </IconButton>
                    </InputAdornment>
                    ),
                  }}
                />
              </>
            ) : (
              // Display task name and delete button without textfield
              <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography
                  variant="body1"
                  sx={{ maxWidth: 350, textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => setEditingTask(task)}
                >
                  {task.name}
                </Typography>
                
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Delete />
                  </IconButton>
              </Box>
            )}
>>>>>>> Stashed changes:src/pages/TodoPage.tsx
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Button variant="outlined" onClick={() => setIsAdding(true)}>Ajouter une tâche</Button>
          </Box>
        )}
      </Box>
<<<<<<< Updated upstream:src/components/TodoPage.tsx
=======

      {/* Display TextField to create a new task and hide the add new task button */}
      {isAdding && !editingTask && (
        <>
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <TextField
              size="small"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              fullWidth
              sx={{ maxWidth: 350 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                  <IconButton color="success" title="Sauvegarder" onClick={handleSave}>
                    <Check />
                  </IconButton>
                  <IconButton color="secondary" title="Annuler" onClick={() => setIsAdding(false)}>
                    <Undo />
                  </IconButton>
                </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value as number)} 
              displayEmpty 
              fullWidth 
              sx={{ maxWidth: 350 }}
            >
              <MenuItem value="" disabled>
                -- Veuillez sélectioner une catégorie --
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </Box>
        </>
      )}

      {/* Show add new task button */}
      {!isAdding && !editingTask && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button variant="outlined" onClick={() => setIsAdding(true)}>Ajouter une tâche</Button>
        </Box>
      )}
>>>>>>> Stashed changes:src/pages/TodoPage.tsx
    </Container>
  );
};

export default TodoPage;
