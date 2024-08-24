import React, { useState, useEffect } from 'react';
import './TaskModal.css';
import { db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';


const TaskModal = ({ isOpen, onClose, onSave }) => {
  const [taskName, setTaskName] = useState('');
  const [taskStatus, setTaskStatus] = useState('Incomplete');
  const [taskDescription, setTaskDescription] = useState('');
  const currentDate = new Date();


  useEffect(() => {
    if (isOpen) {
      // Empty all spaces when reopening the modal
      setTaskName('');
      setTaskStatus('Incomplete');
      setTaskDescription('');
    }
  }, [isOpen]);


  const handleSave = async () => {
    if (taskName.trim() === '' || taskDescription.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }


    try {
      const newTask = {
        name: taskName,
        status: taskStatus === 'Complete',
        description: taskDescription,
        date: currentDate,
      };
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      onSave({ id: docRef.id, ...newTask }); 
      onClose(); // Closing the modal after saving
    } catch (e) {
      console.error("Error adding document: ", e);
      alert('There was an error saving the task.');
    }
  };


  if (!isOpen) return null;


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Task</h2>
        <label>
          Task Name:
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </label>
        <label>
          Status:
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
          >
            <option value="Incomplete">Incomplete</option>
            <option value="Complete">Complete</option>
          </select>
        </label>
        <label>
          Description:
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            maxLength="200"
            required
          />
          <p>{taskDescription.length}/200</p>
        </label>
        <label>
          Date of Creation: <span>{currentDate.toLocaleDateString()}</span>
        </label>
        <div className="modal-buttons">
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};


export default TaskModal;