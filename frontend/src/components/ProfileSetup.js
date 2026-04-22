import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../auth/auth.css'; // Reusing the same styling

export default function ProfileSetup() {
  const [profile, setProfile] = useState({
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    healthIssues: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Calculate BMI roughly (optional, backend can do it too)
    const heightInMeters = profile.height / 100;
    const bmi = (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);

    // Call API (We need to build this endpoint in .NET next!)
    console.log("Saving Profile:", { ...profile, bmi });
    
    // Simulate success
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Tell Us About You</h2>
        <p className="subtitle">So FitBot can give you personalized advice</p>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-group">
              <label>Age</label>
              <input type="number" required onChange={e => setProfile({...profile, age: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select onChange={e => setProfile({...profile, gender: e.target.value})}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-group">
               <label>Height (cm)</label>
               <input type="number" required placeholder="175" onChange={e => setProfile({...profile, height: e.target.value})} />
            </div>
            <div className="input-group">
               <label>Weight (kg)</label>
               <input type="number" required placeholder="70" onChange={e => setProfile({...profile, weight: e.target.value})} />
            </div>
          </div>

          <div className="input-group">
            <label>Medical Conditions (Optional)</label>
            <input type="text" placeholder="e.g. Diabetes, Knee pain" onChange={e => setProfile({...profile, healthIssues: e.target.value})} />
          </div>

          <button type="submit" className="primary-btn">Start Chatting →</button>
        </form>
      </div>
    </div>
  );
}