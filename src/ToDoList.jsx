import React, { useState, useEffect } from "react";
import Weather from "./weather";

function ToDoList() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");
        return savedTasks ? JSON.parse(savedTasks) : [
            "Eat Breakfast",
            "Take Shower",
            "Complete Assignment"
        ];
    });
    const [newTask, setNewTask] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");



    // Add these state variables at the top
    const [location, setLocation] = useState('');
    const [showWeather, setShowWeather] = useState(false);




    // Persist tasks to localStorage
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    // Check authentication status on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem("isAuthenticated");
        if (storedAuth === "true") {
            setIsAuthenticated(true);
            setUsername(localStorage.getItem("username") || "User");
        }
    }, []);

    // Auth handlers
    const handleLogin = () => {
        if (username.trim() !== "") {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("username", username);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
    };

    // Task input handler
    const handleInputChange = (e) => {
        setNewTask(e.target.value);
    };

    // Task management functions
    const addTask = () => {
        if (newTask.trim()) {
            setTasks(prev => [...prev, newTask]);
            setNewTask("");
        }
    };

    const deleteTask = (index) => {
        setTasks(prev => prev.filter((_, i) => i !== index));
    };

    const moveTaskUp = (index) => {
        if (index > 0) {
            const updated = [...tasks];
            [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
            setTasks(updated);
        }
    };

    const moveTaskDown = (index) => {
        if (index < tasks.length - 1) {
            const updated = [...tasks];
            [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
            setTasks(updated);
        }
    };

    return (
        <div className="container">
            {!isAuthenticated ? (
                <div className="auth-container">
                    <div className="auth-card">
                        <h2>Welcome to TodoApp</h2>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            />
                            <button onClick={handleLogin} className="auth-button">
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="todo-container">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>

                    <h1>{username}'s Todo List</h1>

                    <div className="weather-section">
                        <div className="weather-input-group">
                            <input
                                type="text"
                                placeholder="Enter city for weather"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && setShowWeather(true)}
                                style={{color: "black"}}
                            />
                            <button
                                className="weather-btn"
                                onClick={() => setShowWeather(true)}
                            >
                                Get Weather
                            </button>
                        </div>
                        {showWeather && <Weather location={location} />}
                    </div>


                    <div className="input-section">
                        <input
                            type="text"
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={handleInputChange}
                            onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        />
                        <button onClick={addTask} className="add-button">
                            Add Task
                        </button>
                    </div>

                    <ol className="task-list">
                        {tasks.map((task, index) => (
                            <li key={index} className="task-item">
                                <span className="task-text">{task}</span>
                                <div className="task-controls">
                                    <button
                                        className="move-btn up-btn"
                                        onClick={() => moveTaskUp(index)}
                                        disabled={index === 0}
                                        aria-label="Move task up"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="move-btn down-btn"
                                        onClick={() => moveTaskDown(index)}
                                        disabled={index === tasks.length - 1}
                                        aria-label="Move task down"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteTask(index)}
                                        aria-label="Delete task"
                                    >
                                        ×
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}

export default ToDoList;