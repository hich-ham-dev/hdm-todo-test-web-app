import {
  Check,
  Delete,
  House,
  Undo,
  Work,
} from '@mui/icons-material';

import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';
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
  const [ editingTask, setEditingTask ] = useState<Task | null>(null);

  // Fetch tasks
  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  // Fetch categories
  const handleFetchCategories = async () => setCategories(await api.get('/categories'));

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
      await api.post('/tasks', { name: newTaskName, categoryId: selectedCategory });
      setNewTaskName('');
      setSelectedCategory('');
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

        await api.patch(`/tasks/${editingTask.id}`, { name: editingTask.name, categoryId: selectedCategory });
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
    handleFetchCategories();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box  
        display="flex" 
        justifyContent="center" 
        mt={5}
        bgcolor={'#8ec8f2'}
      >
        <Typography 
          variant="h2"
          color={'#f0f8fe'}
        >
          HDM Todo List
        </Typography>
      </Box>

      {/* Show add new task button */}
      {!isAdding && !editingTask && (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          mt={2}>
          
          <Button 
            variant="outlined" 
            onClick={() => setIsAdding(true)}
            fullWidth
            sx={{ maxWidth: 350 }}
          >
          Ajouter une tâche
          </Button>
        </Box>
      )}

      {/* Display TextField to create a new task and hide the add new task button */}
      {isAdding && !editingTask && (
          <>
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              mt={2}
            >
              <TextField
                size="small"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                fullWidth
                sx={{ maxWidth: 350 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                    <IconButton 
                      color="success" 
                      title="Sauvegarder" 
                      onClick={handleSave}
                    >
                      <Check />
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      title="Annuler" 
                      onClick={() => setIsAdding(false)}
                    >
                      <Undo />
                    </IconButton>
                  </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              mt={2}
            >
              <Select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value as number)} 
                displayEmpty 
                fullWidth 
                sx={{ maxWidth: 350 }}
              >
                <MenuItem value="" disabled>
                  -- Veuillez sélectionner une catégorie --
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </Box>
          </>
        )}


      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mx={'auto'}
        mt={5}
        py={2} 
        sx={{border:1, borderRadius:1, borderColor: '#8ec8f2'}}
        width={450}
        bgcolor={'#f0f8fe'}
        boxShadow={3}
      >
        <Box 
          justifyContent="center" 
          mt={5} 
          flexDirection="column"
        >
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
                <Box 
                  display={'flex'} 
                  alignItems={'center'} 
                  justifyContent={'space-between'} 
                  width="350px"
                  bgcolor={'#8ec8f2'}
                  padding={1}
                  borderRadius={2}
                >
                    <Typography
                      variant="body1"
                      color={'#f0f8fe'}
                      fontWeight={'bold'}
                      sx={{ flexGrow: 1, textAlign: 'left', cursor: 'pointer' }}
                      onClick={() => setEditingTask(task)}
                    >
                    {task.name}
                    {task.category.name === 'Maison' ? (
                      <Chip
                      icon={<House />} 
                      label={task.category.name}
                      size="small"
                      sx={{ marginLeft: 1, bgcolor: '#f0f8fe', color: '#4b97e6' }}
                      />
                    ) : task.category.name === 'Travail' ? (
                      <Chip
                        icon={<Work />}
                        label={task.category.name}
                        size="small"
                        sx={{ marginLeft: 1, bgcolor: '#f0f8fe', color: '#4b97e6' }}
                      />
                    ) : null}
                    </Typography>
                  
                  <IconButton
                    color="error"
                    title="Supprimer"
                    onClick={() => handleDelete(task.id)}
                  >
                  <Delete />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}
        </Box>        
      </Box>
    </Container>
  );
};

export default TodoPage;
