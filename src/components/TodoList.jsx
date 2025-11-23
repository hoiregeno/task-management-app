import React, { useEffect, useRef, useState } from "react";
import { UpIcon, DownIcon, CloseIcon } from "../assets/index";
import "../styles/TodoList.css";

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    return saved ? saved : [];
  });
  const [newTask, setNewTask] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  // Auto-focus the input field only once when reload or startup.
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Run on every tasks[] change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleNewTask = (e) => {
    e.preventDefault();
    const cleanTask = newTask.trim();

    // Verify user input
    if (!cleanTask) {
      setErrorMessage("You didn't enter anything. Please enter your task.");
      return;
    }
    if (tasks.some(({ label }) => label === cleanTask)) {
      setNewTask("");
      setErrorMessage(`'${cleanTask}' already exists. Try again.`);
      return;
    }

    // Add new task to list
    setTasks((prev) => [...prev, { id: Date.now() + 1, label: cleanTask }]);

    // Reset
    setNewTask("");
    setErrorMessage("");
  };

  // Delete task based on the index provided.
  const deleteTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index)); // keep only items with different indexes.
  };

  // Move task up/down based on the direction provided.
  const moveTask = (index, direction) => {
    const updatedTasks = [...tasks]; // shallow copy tasks[]

    // Move task up
    if (index > 0 && direction === "up") {
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
      return;
    }

    // Move task down
    if (index < updatedTasks.length - 1 && direction === "down") {
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
      return;
    }
  };

  return (
    <>
      <h1>My List</h1>
      <form onSubmit={handleNewTask}>
        <input
          ref={inputRef}
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter your task"
        />
        <button type="submit">Add</button>
      </form>

      {errorMessage && <p>{errorMessage}</p>}

      <ul>
        {tasks.map(({ id, label }, index) => (
          <li key={id}>
            {label}
            <div className="control-container">
              <button onClick={() => deleteTask(index)}>
                <CloseIcon />
              </button>
              <button onClick={() => moveTask(index, "up")}>
                <UpIcon />
              </button>
              <button onClick={() => moveTask(index, "down")}>
                <DownIcon />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TodoList;
