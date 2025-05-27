
import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/ecowattAPI';
import { useAuth } from '../context/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          setIsLoading(true);
          const data = await getProfile();
          setProfile(data);
          setEditName(data.username || data.name || '');
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: 'Error',
            description: 'Failed to load profile. Please try again later.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated, toast]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (profile) {
      setEditName(profile.username || profile.name || '');
    }
  };

  const handleSave = async () => {
    if (editName.trim()) {
      try {
        await updateProfile(editName.trim());
        setProfile(prev => ({ ...prev, username: editName.trim(), name: editName.trim() }));
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully!",
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Update failed",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>
        <Card className="p-6 text-center">
          <p>Unable to load profile. Please try again later.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">
        Your Profile
      </h1>
      
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
              🌿
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <Input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-center text-xl max-w-xs mx-auto"
                />
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleSave}>Save</Button>
                  <Button variant="outline" onClick={handleEditToggle}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-2">{profile.username || profile.name}</h2>
                <Button variant="outline" onClick={handleEditToggle}>Edit Name</Button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">Points Earned</div>
              <div className="text-2xl font-bold text-primary">{profile.points || 0}</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">Tasks Completed</div>
              <div className="text-2xl font-bold text-primary">{profile.completedTasks || 0}</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">Badges Earned</div>
              <div className="text-2xl font-bold text-primary">{profile.badges || 0}</div>
            </Card>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-2">💡 Eco Tip of the Day</h3>
            <p className="text-sm">Replace single-use items with reusable alternatives to reduce waste. Try reusable grocery bags, water bottles, and food containers!</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
