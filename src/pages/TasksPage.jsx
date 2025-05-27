
import React, { useState, useEffect } from 'react';
import { getTasks, completeTask } from '../api/ecowattAPI';
import { useAuth } from '../context/AuthContext';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      if (isAuthenticated) {
        try {
          setIsLoading(true);
          const data = await getTasks();
          setTasks(data.tasks);
        } catch (error) {
          console.error('Error fetching tasks:', error);
          toast({
            title: 'Error',
            description: 'Failed to load tasks. Please try again later.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTasks();
  }, [isAuthenticated, toast]);

  const createConfetti = () => {
    const colors = ['#FEC6A1', '#D1F0C2', '#D3E4FD', '#FEF7CD', '#FFDEE2'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = `${Math.random() * 50}%`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.style.opacity = '1';
        confetti.style.transform = `rotate(${Math.random() * 360}deg) translate(${Math.random() * 100 - 50}px, ${Math.random() * 200 + 50}px)`;
        confetti.style.transition = 'all 1s ease-out';
        
        setTimeout(() => {
          confetti.style.opacity = '0';
          setTimeout(() => document.body.removeChild(confetti), 1000);
        }, 1000);
      }, Math.random() * 500);
    }
  };

  const handleTaskToggle = async (taskId) => {
    try {
      const response = await completeTask(taskId);
      
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === taskId || task._id === taskId) {
            if (!task.completed) {
              createConfetti();
              toast({
                title: 'Task Completed!',
                description: `You earned ${response.points_earned} points!`,
              });
            }
            return { ...task, completed: !task.completed };
          }
          return task;
        })
      );

      if (response.new_badges && response.new_badges.length > 0) {
        toast({
          title: 'New Badge Earned!',
          description: `You've earned the ${response.new_badges[0].name} badge!`,
        });
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Daily Eco-Friendly Tasks</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">
        Daily Eco-Friendly Tasks
      </h1>
      
      <div className="max-w-2xl mx-auto space-y-4">
        {tasks.map(task => (
          <Card 
            key={task.id || task._id} 
            className={`p-4 flex items-center gap-4 ${task.completed ? 'opacity-70' : ''}`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleTaskToggle(task.id || task._id)}
              className="w-5 h-5 cursor-pointer"
            />
            <div className="flex-1">
              <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.text}
              </span>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              )}
            </div>
            {task.completed && (
              <span className="text-primary font-medium">
                +{task.points} points ✨
              </span>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
