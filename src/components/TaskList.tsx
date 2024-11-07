import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASKS } from '../queries/getTasks';

const TaskList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_TASKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Tasks</h1>
      <ul>
        {data.getTasks.map((task: any) => (
          <li key={task.id}>
            {task.name} - {task.category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;