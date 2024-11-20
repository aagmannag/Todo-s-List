"use client";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mainTask, setMainTask] = useState([]);
  const [error, setError] = useState(""); // State for error message

  // Function to save tasks in cookies
  const saveTasksToCookies = (tasks) => {
    const jsonString = JSON.stringify(tasks);
    document.cookie = `tasks=${encodeURIComponent(jsonString)}; path=/; max-age=31536000`; // Expires in 1 year
  };

  // Function to load tasks from cookies
  const loadTasksFromCookies = () => {
    const cookies = document.cookie.split("; ");
    const taskCookie = cookies.find((cookie) => cookie.startsWith("tasks="));
    if (taskCookie) {
      const jsonString = decodeURIComponent(taskCookie.split("=")[1]);
      try {
        const savedTasks = JSON.parse(jsonString);
        if (Array.isArray(savedTasks)) {
          setMainTask(savedTasks);
        }
      } catch (error) {
        console.error("Error parsing tasks from cookies:", error);
      }
    }
  };

  // Load tasks when the component mounts
  useEffect(() => {
    loadTasksFromCookies();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title for the task!");
      return; // Exit if title is empty
    }

    const updatedTasks = [...mainTask, { title, desc }];
    setMainTask(updatedTasks);
    saveTasksToCookies(updatedTasks); // Save tasks in cookies
    setTitle("");
    setDesc("");
    setError(""); // Clear error message after successful submission
  };

  const deleteHandler = (i) => {
    const updatedTasks = [...mainTask];
    updatedTasks.splice(i, 1);
    setMainTask(updatedTasks);
    saveTasksToCookies(updatedTasks); // Update tasks in cookies
  };

  let renderTask = <h2 className="text-gray-500 text-center">No Tasks Available</h2>;

  if (mainTask.length > 0) {
    renderTask = mainTask.map((t, i) => {
      return (
        <li
          key={i}
          className="flex items-center justify-between mb-4 p-4 bg-white shadow-lg rounded-lg"
        >
          <div className="flex items-center w-2/3">
            <img
              src="https://img.freepik.com/premium-photo/list-icon-notebook-with-completed-todo-list-3d-render_471402-428.jpg"
              alt="Task Icon"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h5 className="text-xl font-bold text-gray-800">{t.title}</h5>
              <h6 className="text-md text-gray-600">{t.desc}</h6>
            </div>
          </div>
          <button
            onClick={() => deleteHandler(i)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-all"
          >
            Complete
          </button>
        </li>
      );
    });
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/premium-photo/list-icon-notebook-with-completed-todo-list-3d-render_471402-428.jpg')",
        backgroundAttachment: 'fixed', // Ensures background stays fixed
        backgroundPosition: 'center', // Centers the background image
        backgroundSize: 'cover', // Ensures the image covers the whole screen
      }}
    >
      <div className="min-h-screen bg-white bg-opacity-70">
        <h1 className="text-black p-5 text-5xl font-bold text-center uppercase">
          Todo's List
        </h1>
        <form
          onSubmit={submitHandler}
          className="flex flex-col items-center gap-4 p-8 bg-white bg-opacity-90 rounded-md mx-auto mt-8 w-3/4 sm:w-1/2 shadow-lg"
        >
          <input
            type="text"
            className="w-full text-xl border-gray-300 border-2 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Title Here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="w-full text-xl border-gray-300 border-2 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Description Here"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-bold rounded-md shadow-md transition-all"
          >
            Add Task
          </button>
        </form>
        {/* Popup for Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-3/4 sm:w-1/2 mx-auto mb-6">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <button
              className="absolute top-0 right-0 px-4 py-3"
              onClick={() => setError("")}
            >
              <span className="text-red-500 font-bold">&times;</span>
            </button>
          </div>
        )}
        <hr className="my-8 border-gray-300" />
        <div className="p-8 bg-white bg-opacity-90 rounded-md mx-auto w-3/4 sm:w-1/2 shadow-lg">
          <ul className="space-y-4">{renderTask}</ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
