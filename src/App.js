import React, { useState, useEffect } from "react";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Dashboard from "./Components/Dashboard";
import TaskList from "./Components/TaskList";
import NewTask from "./Components/NewTask";
import TaskDetails from './Components/TaskDetails';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const sampleTasks = [
      {
        id: 1,
        title: "Complete project proposal",
        description: "Finish the project proposal document",
        status: "In Progress",
        priority: "High",
        dueDate: new Date().toISOString().split('T')[0],
        assignee: "John Doe",
        comments: ["First draft completed"],
        attachments: ["proposal.docx"]
      },
      {
        id: 2,
        title: "Setup database",
        description: "Configure the database schema",
        status: "To Do",
        priority: "Medium",
        dueDate: "2023-06-15",
        assignee: "Jane Smith",
        comments: [],
        attachments: []
      }
    ];
    setTasks(sampleTasks);
  }, []);

  const handleCreateTask = (newTask) => {
    const createdTask = {
      ...newTask,
      id: Date.now(),
      status: "To Do",
      comments: [],
      attachments: []
    };
    setTasks([...tasks, createdTask]);
    setCurrentView('dashboard');
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setCurrentView('dashboard');
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setCurrentView('taskdetails');
  };

  const views = {
    login: <Login 
             onRegisterClick={() => setCurrentView('register')} 
             onLoginSuccess={handleLoginSuccess} 
           />,
    register: <Register 
                onLoginClick={() => setCurrentView('login')} 
                onRegisterSuccess={handleLoginSuccess} 
              />,
    dashboard: <Dashboard 
                 tasks={tasks} 
                 user={currentUser}
                 onNavigate={(view) => setCurrentView(view)}
                 onLogout={handleLogout}
               />,
    tasklist: <TaskList 
                tasks={tasks} 
                onLogout={handleLogout}
                onNewTask={() => setCurrentView('newtask')}
                onViewTask={handleViewTask}
              />,
    newtask: <NewTask 
               onCreateTask={handleCreateTask} 
               onCancel={() => setCurrentView('dashboard')} 
             />,
    taskdetails: <TaskDetails 
                   task={selectedTask} 
                   onBack={() => setCurrentView('dashboard')}
                   onSave={handleUpdateTask}
                 />
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {views[currentView]}
    </div>
  );
};

export default App;