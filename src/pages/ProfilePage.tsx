
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

type Profile = {
  name: string;
  points: number;
  completedTasks: number;
  joinedDate: string;
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile>({
    name: 'Eco Warrior',
    points: 0,
    completedTasks: 0,
    joinedDate: new Date().toISOString().split('T')[0],
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    // Load profile from localStorage if it exists
    const savedProfile = localStorage.getItem('ecowattProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    
    // Load task data to update points and completed tasks
    const savedTasks = localStorage.getItem('ecowattTasks');
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const completed = tasks.filter((task: {completed: boolean}) => task.completed).length;
      
      setProfile(prev => {
        const updated = {
          ...prev,
          points: completed * 10, // Each task is worth 10 points
          completedTasks: completed
        };
        
        // Save the updated profile to localStorage
        localStorage.setItem('ecowattProfile', JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditName(profile.name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const handleSave = () => {
    if (editName.trim()) {
      const updatedProfile = { ...profile, name: editName.trim() };
      setProfile(updatedProfile);
      localStorage.setItem('ecowattProfile', JSON.stringify(updatedProfile));
      setIsEditing(false);
      toast("Profile updated successfully!");
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '2rem', color: 'var(--primary)', textAlign: 'center', marginBottom: '2rem' }}>
        Your Profile
      </h2>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              fontSize: '3rem', 
              backgroundColor: 'var(--soft-green)', 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              🌿
            </div>
            
            {isEditing ? (
              <div style={{ marginBottom: '1rem' }}>
                <input 
                  type="text" 
                  value={editName}
                  onChange={handleNameChange}
                  style={{ 
                    padding: '0.5rem', 
                    borderRadius: '8px', 
                    border: '2px solid var(--soft-green)',
                    fontSize: '1.25rem',
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '300px'
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{profile.name}</h3>
            )}
            
            {isEditing ? (
              <div>
                <button 
                  onClick={handleSave} 
                  className="button"
                  style={{ marginRight: '0.5rem' }}
                >
                  Save
                </button>
                <button 
                  onClick={handleEditToggle} 
                  className="button secondary"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={handleEditToggle} className="button">Edit Name</button>
            )}
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Points Earned</div>
              <div style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>{profile.points}</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Tasks Completed</div>
              <div style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>{profile.completedTasks}</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Member Since</div>
              <div style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>{new Date(profile.joinedDate).toLocaleDateString()}</div>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--soft-yellow)', borderRadius: '12px' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>💡 Eco Tip of the Day</h4>
            <p>Replace single-use items with reusable alternatives to reduce waste. Try reusable grocery bags, water bottles, and food containers!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
