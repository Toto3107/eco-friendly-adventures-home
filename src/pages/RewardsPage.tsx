
import React, { useState, useEffect } from 'react';
import { getRewards } from '../api/ecowattAPI';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  unlocked: boolean;
}

interface RewardsData {
  badges: Badge[];
  userPoints: number;
}

const RewardsPage = () => {
  const [rewards, setRewards] = useState<RewardsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setIsLoading(true);
        const data = await getRewards();
        setRewards(data as RewardsData);
      } catch (error) {
        console.error('Error fetching rewards:', error);
        toast({
          title: 'Error',
          description: 'Failed to load rewards. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewards();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Rewards</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading rewards...</p>
        </div>
      </div>
    );
  }

  if (!rewards) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Rewards</h1>
        <Card className="p-6 text-center">
          <p>Unable to load rewards. Please try again later.</p>
        </Card>
      </div>
    );
  }

  const nextBadge = rewards.badges.find(badge => !badge.unlocked);
  const progressPercentage = nextBadge 
    ? Math.min(100, (rewards.userPoints / nextBadge.pointsRequired) * 100)
    : 100;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Rewards</h1>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-2xl">🏆</span>
          <div className="flex-1">
            <Progress value={progressPercentage} className="h-3" />
          </div>
          <span className="font-medium">{rewards.userPoints} points</span>
        </div>
        {nextBadge && (
          <p className="text-sm text-gray-500 mt-2">
            {nextBadge.pointsRequired - rewards.userPoints} more points until you earn the {nextBadge.name} badge!
          </p>
        )}
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Badges</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.badges.map(badge => (
          <Card 
            key={badge.id} 
            className={`p-6 ${!badge.unlocked ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{badge.icon}</div>
              <div>
                <h3 className="font-semibold text-lg">{badge.name}</h3>
                <p className="text-gray-600 text-sm">{badge.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {badge.pointsRequired} points
                  </span>
                  {badge.unlocked ? (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RewardsPage;
