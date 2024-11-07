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

        console.log('Task en cours d\'édition:', editingTask);
        console.log('Task trouvée dans la liste:', task);
        console.log('Catégorie sélectionnée:', selectedCategory);
        
        const hasChanged = !task || task.name !== editingTask.name || task.category.id !== selectedCategory;

        if (!hasChanged) {
          toast.info('Aucune modification n\'a été apportée à la tâche');
          return;
        }

        const updateData: { 
          name: string; 
          categoryId?: number 
        } = {
          name: editingTask.name,
        };

        console.log('Données à envoyer:', updateData);
        console.log('URL de la requête:', `/tasks/${editingTask.id}`);

        if (selectedCategory !== '') {
          updateData.categoryId = selectedCategory;
        }

        const updatedTask = await api.patch(`/tasks/${editingTask.id}`, updateData);
        console.log('Réponse du serveur:', updatedTask);

        setEditingTask(null);
        setSelectedCategory('');
        await handleFetchTasks();
        toast.success('Tâche mise à jour avec succès');
      } catch (error) {
        toast.error('Une erreur est survenue lors de la mise à jour de la tâche');
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setSelectedCategory(task.category.id);
  }

  useEffect(() => {
    
    handleFetchTasks();
    handleFetchCategories();
  }, []);

  return (
    <>
      <Typography 
            variant="h2"
            color={'#f0f8fe'}
            bgcolor={'#8ec8f2'}
            textAlign={'center'}
            width={'100'}
          >
            HDM Todo List
          </Typography>
      <Container maxWidth="lg">

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
              sx={{ 
                maxWidth: 450, 
                borderColor: '#8ec8f2', 
                color: '#8ec8f2' 
              }}
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
          mt={2}
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
                        onClick={() => handleEditTask(task)}
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
    </>
  );
};

export default TodoPage;
