import { useState, useEffect } from "react";
import axios from "axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/todos?_limit=5"
        );
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError("Couldn't get tasks. Check your internet!");
        setLoading(false);
      }
    };

    getTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/todos",
        {
          title: newTask,
          completed: false,
        }
      );
      setTasks([...tasks, { ...response.data, id: Date.now() }]);
      setNewTask("");
    } catch (err) {
      setError("Couldn't add the task.");
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditText(task.title);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        title: editText,
        completed: tasks.find((task) => task.id === id).completed,
      });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, title: editText } : task
        )
      );
      setEditingTask(null);
      setEditText("");
    } catch (err) {
      setError("Couldn't update the task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError("Couldn't delete the task.");
    }
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  if (loading) return <p className="text-center mt-6">Loading tasks...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Tasks</h1>
      <form onSubmit={addTask} className="mb-6 flex space-x-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add
        </button>
      </form>
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks yet. Add one!</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="p-4 bg-white rounded-lg shadow flex items-center justify-between"
            >
              {editingTask === task.id ? (
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className="mr-2 h-5 w-5"
                    />
                    <span
                      className={`${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => startEditing(task)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks;