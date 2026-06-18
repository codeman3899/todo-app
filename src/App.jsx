import { useState, useEffect } from "react";

const API = "https://todo-api-c3nt.onrender.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    async function getTodos() {
      const res = await fetch(`${API}/todos`);
      const data = await res.json();
      setTodos(data);
    }
    getTodos();
  }, []);

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

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Todo App</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Add a todo..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button onClick={addTodo} style={{
          padding: "10px 20px", background: "blue",
          color: "white", border: "none", borderRadius: "6px", cursor: "pointer"
        }}>Add</button>
      </div>
      {todos.map(todo => (
        <div key={todo.id} style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px", background: "white", borderRadius: "8px",
          marginBottom: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo)}
          />
          <span style={{
            flex: 1,
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed ? "#999" : "#333"
          }}>{todo.title}</span>
          <button onClick={() => deleteTodo(todo.id)} style={{
            background: "red", color: "white", border: "none",
            padding: "5px 10px", borderRadius: "4px", cursor: "pointer"
          }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;