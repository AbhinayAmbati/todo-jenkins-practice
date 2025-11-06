import { useEffect, useState } from "react";
import axios from "axios";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  const config = import.meta.env.VITE_API_URL;

  const API = config;

  const fetchTodos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/all`);
      setTodos(res.data);
    } catch (err) {
      setError("Failed to fetch todos");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);
  

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setError("");
    try {
      await axios.post(`${API}/create-custom`, {}, {
        params: { title: form.title, description: form.description }
      });
      setForm({ title: "", description: "" });
      fetchTodos();
    } catch (err) {
      setError("Failed to create todo");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await axios.delete(`${API}/${id}`);
      fetchTodos();
    } catch (err) {
      setError("Failed to delete todo");
    }
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditForm({ title: todo.title, description: todo.description });
  };

  const handleUpdate = async () => {
    if (!editForm.title.trim()) return;
    setError("");
    try {
      await axios.put(`${API}/${editId}`, {}, {
        params: { title: editForm.title, description: editForm.description }
      });
      setEditId(null);
      fetchTodos();
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  const toggleComplete = async (todo) => {
    setError("");
    try {
      await axios.put(`${API}/${todo.id}`, {}, {
        params: { completed: !todo.completed }
      });
      fetchTodos();
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Todo App</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add Todo */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <input
          type="text"
          placeholder="Enter todo title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="w-full p-3 border rounded mb-3 focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Enter description (optional)"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full p-3 border rounded mb-3 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add Todo
        </button>
      </div>

      {/* Todo List */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div key={todo.id} className="border rounded-lg p-4 bg-white shadow-sm">
              {editId === todo.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo)}
                      className="mt-1"
                    />
                    <div>
                      <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                          {todo.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(todo)}
                      className="text-blue-500 hover:text-blue-700 px-2 py-1 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {todos.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No todos yet. Add your first todo above!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Todo;