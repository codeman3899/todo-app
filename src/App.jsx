import { useState, useEffect } from "react";
import { useUser, SignInButton, SignOutButton } from "@clerk/clerk-react";

const API = "https://todo-api-c3nt.onrender.com";

function App() {
  const { isSignedIn, user } = useUser();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!isSignedIn) return;
    async function getTodos() {
      const res = await fetch(`${API}/todos`);
      const data = await res.json();
      setTodos(data);
    }
    getTodos();
  }, [isSignedIn]);

  async function addTodo() {
    if (!title) return;
    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setTitle("");
  }

  async function deleteTodo(id) {
    await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter(t => t.id !== id));
  }

  async function toggleTodo(todo) {
    const res = await fetch(`${API}/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: todo.title, completed: !todo.completed }),
    });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === todo.id ? updated : t));
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Todo App</h1>
        <p className="text-gray-500 mb-8">Please sign in to continue</p>
        <SignInButton mode="modal">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 cursor-pointer">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto pt-10 px-4">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Todo App</h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">Hi, {user.firstName}</span>
            <SignOutButton>
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 cursor-pointer">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            placeholder="Add a todo..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
          >
            Add
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {todos.map(todo => (
            <div key={todo.id} className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                className="w-5 h-5 cursor-pointer"
              />
              <span className={`flex-1 text-gray-800 ${todo.completed ? "line-through text-gray-400" : ""}`}>
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;