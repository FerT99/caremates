import React, { useState, useEffect } from 'react';
import './Card.css';
import carematesLogo from './logo.png';
import TaskModal from './TaskModal';
import { db } from './firebaseConfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';


const Card = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleDescriptionId, setVisibleDescriptionId] = useState(null); // Estado para controlar la visibilidad de la descripción


  // Obtener las tareas desde Firebase
  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollection = collection(db, 'tasks');
      const q = query(tasksCollection, orderBy('date', 'asc'));
      const tasksSnapshot = await getDocs(q);
      const tasksList = tasksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksList);
    };


    fetchTasks();
  }, []);


  const handleStatusChange = async (id, currentStatus) => {
    try {
      // Actualizar el estado localmente
      setTasks(tasks.map(task =>
        task.id === id
          ? { ...task, status: !currentStatus }
          : task
      ));
 
      // Actualizar el estado en Firebase
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        status: !currentStatus,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("There was an error updating the task status.");
    }
  };
 


  const handleDelete = async (id) => {
    try {
      // Elimina la tarea de Firebase Firestore
      await deleteDoc(doc(db, 'tasks', id));
 
      // Luego, elimina la tarea del estado local
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting document: ', error);
      alert('There was an error deleting the task.');
    }
  };


  const handleToggleDescription = (id) => {
    setVisibleDescriptionId(visibleDescriptionId === id ? null : id);
  };


  const handleAddTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
 


  return (
    <div className="card">
      <header>
        <img src={carematesLogo} alt="CareMates Logo" className="caremates-logo" />
        <h1>Patient care - onboarding process</h1>
      </header>
      <table>
        <thead>
          <tr>
            <th>Tasks</th>
            <th>Date of creation</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {tasks.map(task => (
          <React.Fragment key={task.id}>
            <tr
              onClick={() => handleToggleDescription(task.id)}
              className="task-row"
            >
              <td>
                <span className={`arrow ${visibleDescriptionId === task.id ? 'down' : 'right'}`}>
                  ▶
                </span>
                {task.name}
              </td>
              <td>
                {
                  new Date(task.date.seconds ? task.date.toDate() : task.date).toLocaleDateString()
                }
              </td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(task.id, task.status);
                  }}
                  className={task.status ? 'status-button complete' : 'status-button incomplete'}
                >
                  {task.status ? 'Complete' : 'Incomplete'}
                </button>
              </td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(task.id);
                  }}
                  className="delete-button"
                >
                  🗑️
                </button>
              </td>
            </tr>
            {visibleDescriptionId === task.id && (
              <tr>
                <td colSpan="4">
                  <p className="task-description">{task.description}</p>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
        </tbody>
      </table>
      <button onClick={() => setIsModalOpen(true)} className="add-task-button">+ Add new task</button>
     
      {/* Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTask}
      />
    </div>
  );
};


export default Card;
