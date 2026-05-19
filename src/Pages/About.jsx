import React, { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { 
  Plus, 
  Layout, 
  Clock, 
  Trash2, 
  Calendar, 
  BarChart3, 
  Users, 
  ChevronRight, 
  X, 
  Edit3, 
  Save,
  UserPlus,
  Activity,
  Briefcase,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

/** ─── STYLING ─── */
const styles = `
  :root {
    --bg: #050505;
    --card: #0d0d0d;
    --accent: #b5ff4d;
    --accent-dim: rgba(181, 255, 77, 0.1);
    --text-main: #f0f0f0;
    --text-dim: #777;
    --border: rgba(255, 255, 255, 0.06);
    --glass: rgba(255, 255, 255, 0.03);
  }

  .pm-app {
    background: var(--bg);
    color: var(--text-main);
    font-family: 'DM Sans', -apple-system, sans-serif;
    height: 100vh;
    display: flex;
    overflow: hidden;
    position: relative;
  }

  .sidebar {
    width: 280px;
    background: var(--card);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 2rem 1.2rem;
    z-index: 20;
    position: relative;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--text-dim);
    margin-bottom: 6px;
    font-weight: 500;
    font-size: 0.95rem;
  }

  .nav-item:hover, .nav-item.active {
    background: var(--glass);
    color: var(--accent);
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    position: relative;
    padding: 2.5rem;
    z-index: 5;
    display: flex;
    flex-direction: column;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto auto;
    gap: 1.5rem;
    flex: 1;
  }

  .bento-card {
    background: var(--card);
    border: 1px solid var(--border);
    padding: 1.5rem;
    border-radius: 24px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: border 0.3s ease;
  }

  .bento-card:hover {
    border-color: rgba(181, 255, 77, 0.3);
  }

  .span-2 { grid-column: span 2; }
  .row-2 { grid-row: span 2; }

  .user-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  .user-table th {
    text-align: left;
    color: var(--text-dim);
    font-size: 0.75rem;
    text-transform: uppercase;
    padding: 12px;
    border-bottom: 1px solid var(--border);
  }

  .user-table td {
    padding: 16px 12px;
    border-bottom: 1px solid var(--border);
    font-size: 0.9rem;
  }

  .glass-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    color: white;
    padding: 12px 16px;
    border-radius: 12px;
    outline: none;
    width: 100%;
    margin-top: 8px;
  }

  .btn-primary {
    background: var(--accent);
    color: black;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.2s ease;
  }

  .btn-primary:hover { transform: scale(1.02); }
  
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #222;
    display: grid;
    place-items: center;
    color: var(--accent);
    font-weight: bold;
    border: 1px solid var(--border);
  }

  .kanban-col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 300px;
  }
`;

/** ─── 3D BACKGROUND ─── */
function Background3D() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, opacity: 0.2, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Environment preset="night" />
        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1}>
          <mesh position={[4, 2, -3]}>
            <octahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color="#b5ff4d" wireframe opacity={0.1} transparent />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
}

export default function ProjectDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("nexus_tasks");
    return saved ? JSON.parse(saved) : [
      { id: "1", title: "Refactor API Layer", desc: "Low latency focus", status: "todo", priority: "high", user: "Kunal S.", date: "May 12" },
      { id: "2", title: "System Architecture", desc: "Microservices mesh", status: "in-progress", priority: "med", user: "Aditya P.", date: "May 15" },
    ];
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("nexus_users");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Kunal S.", role: "Lead Engineer", email: "kunal@nexus.ai" },
      { id: "2", name: "Aditya P.", role: "Product Designer", email: "aditya@nexus.ai" },
    ];
  });

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userForm, setUserForm] = useState({ name: "", role: "", email: "" });
  const [taskForm, setTaskForm] = useState({ title: "", desc: "", priority: "med", user: users[0]?.name || "" });

  useEffect(() => { localStorage.setItem("nexus_tasks", JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem("nexus_users", JSON.stringify(users)); }, [users]);

  // --- ACTIONS ---
  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = { ...userForm, id: Date.now().toString() };
    setUsers([...users, newUser]);
    setIsUserModalOpen(false);
    setUserForm({ name: "", role: "", email: "" });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = { 
        ...taskForm, 
        id: Date.now().toString(), 
        status: "todo", 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
    };
    setTasks([...tasks, newTask]);
    setIsTaskModalOpen(false);
    setTaskForm({ title: "", desc: "", priority: "med", user: users[0]?.name || "" });
  };

  const moveTask = (id, currentStatus) => {
    const stages = ["todo", "in-progress", "done"];
    const nextIdx = (stages.indexOf(currentStatus) + 1) % stages.length;
    setTasks(tasks.map(t => t.id === id ? { ...t, status: stages[nextIdx] } : t));
  };

  const stats = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    progress: tasks.filter(t => t.status === 'in-progress').length,
    efficiency: Math.round((tasks.filter(t => t.status === 'done').length / (tasks.length || 1)) * 100) || 0
  }), [tasks]);

  return (
    <div className="pm-app">
      <style>{styles}</style>
      <Background3D />

      <aside className="sidebar">
        <div style={{ padding: "0 1rem 2.5rem", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 35, height: 35, background: "var(--accent)", borderRadius: "10px", display: 'grid', placeItems: 'center', color: 'black' }}><Layout size={20}/></div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-1px" }}>NEXUS</h2>
        </div>

        <nav style={{ flex: 1 }}>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <BarChart3 size={20} /> Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'board' ? 'active' : ''}`} onClick={() => setActiveTab('board')}>
            <Layout size={20} /> Projects
          </div>
          <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={20} /> Team Members
          </div>
          <div className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
            <Calendar size={20} /> Schedule
          </div>
        </nav>

        <div className="nav-item" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <ShieldCheck size={20} /> Admin Portal
        </div>
      </aside>

      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p style={{ color: "var(--text-dim)" }}>Intelligence-driven workspace</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" style={{ background: 'var(--glass)', color: 'white', border: '1px solid var(--border)' }} onClick={() => setIsUserModalOpen(true)}>
                <UserPlus size={18} /> Add Member
            </button>
            <button className="btn-primary" onClick={() => setIsTaskModalOpen(true)}>
                <Plus size={18} /> New Task
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            <div className="bento-card">
              <Activity size={20} color="var(--accent)" />
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '1rem' }}>Overall Efficiency</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{stats.efficiency}%</h2>
              <div style={{ height: 4, background: '#222', borderRadius: 2, marginTop: 'auto' }}>
                <div style={{ width: `${stats.efficiency}%`, height: '100%', background: 'var(--accent)' }} />
              </div>
            </div>

            <div className="bento-card">
              <Users size={20} color="var(--accent)" />
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '1rem' }}>Active Team</p>
              <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{users.length}</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>+2 this month</p>
            </div>

            <div className="bento-card span-2">
               <Briefcase size={20} color="var(--accent)" />
               <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '1rem' }}>Task Distribution</p>
               <div style={{ display: 'flex', gap: '20px', marginTop: '1rem' }}>
                  <div><h4 style={{ margin: 0 }}>{stats.done}</h4><span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Completed</span></div>
                  <div><h4 style={{ margin: 0 }}>{stats.progress}</h4><span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>In Progress</span></div>
                  <div><h4 style={{ margin: 0 }}>{stats.total}</h4><span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Total Scope</span></div>
               </div>
            </div>

            <div className="bento-card span-2 row-2">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Team Performance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {users.map(u => (
                        <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: 'var(--glass)', borderRadius: '14px' }}>
                            <div className="avatar">{u.name[0]}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{u.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{u.role}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>{tasks.filter(t => t.user === u.name && t.status === 'done').length}</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>TASKS</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bento-card span-2">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Active Sprints</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {['Q2 Roadmap', 'Mobile Launch', 'SEO Sweep'].map(s => (
                        <span key={s} style={{ padding: '6px 12px', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.75rem' }}>{s}</span>
                    ))}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bento-card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Workspace Directory</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total: {users.length} members</span>
            </div>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Load</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="avatar" style={{ width: 30, height: 30 }}>{u.name[0]}</div>
                            {u.name}
                        </div>
                    </td>
                    <td>{u.role}</td>
                    <td style={{ color: 'var(--text-dim)' }}>{u.email}</td>
                    <td>
                        <div style={{ width: 60, height: 6, background: '#222', borderRadius: 3 }}>
                            <div style={{ width: '40%', height: '100%', background: 'var(--accent)', borderRadius: 3 }} />
                        </div>
                    </td>
                    <td><Trash2 size={16} color="#ff6464" style={{ cursor: 'pointer' }} onClick={() => setUsers(users.filter(x => x.id !== u.id))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'board' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', flex: 1, alignItems: 'start' }}>
                {['todo', 'in-progress', 'done'].map((column) => (
                    <div key={column} className="kanban-col">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 0.5rem' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: column === 'done' ? 'var(--accent)' : '#555' }} />
                            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '1px' }}>{column.replace('-', ' ')}</h3>
                            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-dim)' }}>{tasks.filter(t => t.status === column).length}</span>
                        </div>
                        
                        {tasks.filter(t => t.status === column).map(task => (
                            <div key={task.id} className="bento-card" style={{ padding: '1.2rem', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '0.65rem', color: task.priority === 'high' ? '#ff6464' : 'var(--accent)', background: 'var(--glass)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                        {task.priority.toUpperCase()}
                                    </span>
                                    <Trash2 size={14} color="var(--text-dim)" style={{ cursor: 'pointer' }} onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', marginBottom: '4px' }}>{task.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>{task.desc || "No description provided."}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div className="avatar" style={{ width: 24, height: 24, fontSize: '0.7rem' }}>{task.user[0]}</div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{task.user}</span>
                                    </div>
                                    <button 
                                        onClick={() => moveTask(task.id, task.status)}
                                        style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'white', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
                                    >
                                        {column === 'done' ? <CheckCircle2 size={14} color="var(--accent)" /> : <ChevronRight size={14} />}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {tasks.filter(t => t.status === column).length === 0 && (
                            <div style={{ border: '1px dashed var(--border)', borderRadius: '24px', padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                No tasks here
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </main>

      {/* MODALS */}
      {isUserModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#0a0a0a", width: "400px", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border)" }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Team Member</h2>
            <form onSubmit={handleAddUser}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>FULL NAME</label>
                <input className="glass-input" required value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
                <div style={{ marginTop: '1rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ROLE</label>
                    <input className="glass-input" required value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} />
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>EMAIL ADDRESS</label>
                    <input className="glass-input" type="email" required value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
                    <button type="button" className="btn-primary" style={{ background: '#222', color: 'white', flex: 1 }} onClick={() => setIsUserModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save User</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {isTaskModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#0a0a0a", width: "400px", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border)" }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create Task</h2>
            <form onSubmit={handleAddTask}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>TITLE</label>
                <input className="glass-input" required value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} />
                
                <div style={{ marginTop: '1rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>DESCRIPTION</label>
                    <textarea className="glass-input" style={{ minHeight: '80px', resize: 'none' }} value={taskForm.desc} onChange={e => setTaskForm({...taskForm, desc: e.target.value})} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ASSIGN TO</label>
                        <select className="glass-input" value={taskForm.user} onChange={e => setTaskForm({...taskForm, user: e.target.value})}>
                            {users.map(u => <option key={u.id} value={u.name} style={{ color: 'black' }}>{u.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>PRIORITY</label>
                        <select className="glass-input" value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})}>
                            <option value="low" style={{ color: 'black' }}>Low</option>
                            <option value="med" style={{ color: 'black' }}>Medium</option>
                            <option value="high" style={{ color: 'black' }}>High</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}>Create Task</button>
                <button type="button" style={{ width: '100%', marginTop: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }} onClick={() => setIsTaskModalOpen(false)}>Dismiss</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}