import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function AdminDashboard() {
    const { user, logout } = useContext(AuthContext); // 'user' is now used below
    const navigate = useNavigate();
    
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [newCourse, setNewCourse] = useState({ courseName: '', courseCode: '', teacherId: '' });

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        try {
            const [usersRes, coursesRes, teachersRes] = await Promise.all([
                axios.get('/api/admin/users', config),
                axios.get('/api/admin/courses', config),
                axios.get('/api/admin/teachers', config),
            ]);
            setUsers(usersRes.data);
            setCourses(coursesRes.data);
            setTeachers(teachersRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
            if (error.response && error.response.status === 403) {
                alert("Access denied. Logging out.");
                handleLogout();
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('/api/admin/courses', newCourse, { headers: { 'x-auth-token': token } });
            alert('Course created successfully!');
            setNewCourse({ courseName: '', courseCode: '', teacherId: '' });
            fetchData();
        } catch (error) {
            alert('Failed to create course.');
            console.error(error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`/api/admin/users/${userId}`, { headers: { 'x-auth-token': token } });
                alert('User deleted successfully.');
                fetchData();
            } catch (error) {
                alert('Failed to delete user.');
            }
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`/api/admin/courses/${courseId}`, { headers: { 'x-auth-token': token } });
                alert('Course deleted successfully.');
                fetchData();
            } catch (error) {
                alert('Failed to delete course.');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <div>
                {/* This is the line that fixes the warning! */}
                <span>Welcome, {user?.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </header>
        <main className="dashboard-content">
            {/* --- Create Course Form --- */}
            <div className="admin-section">
                <h2>Create New Course</h2>
                <form onSubmit={handleCreateCourse} className="admin-form">
                    <input type="text" placeholder="Course Name (e.g., Intro to Programming)" value={newCourse.courseName} onChange={e => setNewCourse({...newCourse, courseName: e.g.,t.value})} required/>
                    <input type="text" placeholder="Course Code (e.g., CS101)" value={newCourse.courseCode} onChange={e => setNewCourse({...newCourse, courseCode: e.target.value})} required/>
                    <select value={newCourse.teacherId} onChange={e => setNewCourse({...newCourse, teacherId: e.target.value})} required>
                        <option value="">-- Assign a Teacher --</option>
                        {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                    <button type="submit" className="submit-btn">Create Course</button>
                </form>
            </div>

            {/* --- Users Table --- */}
            <div className="admin-section">
                <h2>Manage Users</h2>
                <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td><button onClick={() => handleDeleteUser(u._id)} className="btn absent">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Courses Table --- */}
            <div className="admin-section">
                <h2>Manage Courses</h2>
                <table>
                    <thead><tr><th>Course Name</th><th>Code</th><th>Assigned Teacher</th><th>Actions</th></tr></thead>
                    <tbody>
                        {courses.map(c => (
                            <tr key={c._id}>
                                <td>{c.courseName}</td>
                                <td>{c.courseCode}</td>
                                <td>{c.teacherId ? c.teacherId.name : 'N/A'}</td>
                                <td><button onClick={() => handleDeleteCourse(c._id)} className="btn absent">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
      </div>
    );
}

export default AdminDashboard;

