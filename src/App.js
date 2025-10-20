import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminRegister from "./components/AdminRegister";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import UserManagement from "./components/UserManagement";
import AdminManagement from "./components/AdminManagement";
import UserProfile from "./components/UserProfile";
import NewTask from "./components/NewTask";
import TaskList from "./components/TaskList";
import TaskDetails from "./components/TaskDetails";
import "./App.css";

const App = () => {
  const [currentView, setCurrentView] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // API Base URLs
  const TASK_API_BASE = "http://localhost:8080/TaskManagement/TaskManagement/task";
  const USER_API_BASE = "http://localhost:8080/TaskManagement/TaskManagement/user";
  const ADMIN_API_BASE = "http://localhost:8080/TaskManagement/api/admins";

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentView("dashboard");
    fetchTasks();
    if (userData.profileType === "admin") {
      fetchUsers();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTasks([]);
    setUsers([]);
    setCurrentView("login");
  };

  const handleUpdateProfile = (updatedProfile) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedProfile }));
  };

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
    setCurrentView("tasklist");
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${TASK_API_BASE}/all`);
      const transformedTasks = response.data.map((task) => ({
        ...task,
        assignee: task.assignedUser
          ? `${task.assignedUser.Firstname} ${task.assignedUser.surname}`
          : "Unassigned",
        status: task.status || "TODO",
        priority: task.priority || "MEDIUM",
      }));
      setTasks(transformedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${USER_API_BASE}/getAll`);
      const transformedUsers = response.data.map((user) => ({
        ...user,
        fullName: `${user.Firstname} ${user.surname}`,
        active: user.active !== undefined ? user.active : true,
      }));
      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (currentUser?.profileType === "admin") {
      fetchUsers();
    }
  }, [currentUser]);

  const handleUpdateTask = async (updatedTask) => {
    try {
      await axios.put(`${TASK_API_BASE}/update`, updatedTask);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === updatedTask.id
            ? {
                ...updatedTask,
                assignee: updatedTask.assignedUser
                  ? `${updatedTask.assignedUser.Firstname} ${updatedTask.assignedUser.surname}`
                  : "Unassigned",
              }
            : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${TASK_API_BASE}/delete/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleUserUpdate = () => {
    if (currentUser?.profileType === "admin") fetchUsers();
  };

  const renderCurrentView = () => {
    if (loading && currentView === "dashboard") {
      return (
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      );
    }

    switch (currentView) {
      case "login":
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onRegisterClick={() => setCurrentView("register")}
            onAdminRegisterClick={() => setCurrentView("adminregister")}
          />
        );
      case "register":
        return (
          <Register
            onRegisterSuccess={() => {
              alert("Registration successful! Please login with your credentials.");
              setCurrentView("login");
            }}
            onLoginClick={() => setCurrentView("login")}
          />
        );
      case "adminregister":
        return (
          <AdminRegister
            onRegisterSuccess={() => {
              alert("Admin registration successful! Please login.");
              setCurrentView("login");
            }}
            onLoginClick={() => setCurrentView("login")}
          />
        );
      case "dashboard":
        if (currentUser?.profileType === "admin") {
          return (
            <AdminDashboard
              user={currentUser}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              tasks={tasks}
              users={users}
            />
          );
        } else {
          return (
            <Dashboard
              user={currentUser}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              tasks={tasks}
            />
          );
        }
      case "usermanagement":
        return <UserManagement onBack={() => setCurrentView("dashboard")} onUserUpdate={handleUserUpdate} />;
      case "adminmanagement":
        return <AdminManagement onBack={() => setCurrentView("dashboard")} />;
      case "profile":
        return <UserProfile user={currentUser} onNavigate={setCurrentView} onUpdateProfile={handleUpdateProfile} />;
      case "newtask":
        return <NewTask onTaskCreated={handleTaskCreated} onCancel={() => setCurrentView("dashboard")} users={users} />;
      case "tasklist":
        return (
          <TaskList
            tasks={tasks}
            onLogout={handleLogout}
            onNewTask={() => setCurrentView("newtask")}
            onViewTask={(task) => console.log("View task details:", task)}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onRefresh={fetchTasks}
          />
        );
      case "taskdetails":
        return (
          <TaskDetails
            task={tasks.find((task) => task.id === currentUser?.selectedTaskId) || tasks[0]}
            onBack={() => setCurrentView("tasklist")}
            onSave={handleUpdateTask}
            onDelete={(taskId) => {
              handleDeleteTask(taskId);
              setCurrentView("tasklist");
            }}
          />
        );
      default:
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onRegisterClick={() => setCurrentView("register")}
            onAdminRegisterClick={() => setCurrentView("adminregister")}
          />
        );
    }
  };

  return <div className="App">{renderCurrentView()}</div>;
};

export default App;
