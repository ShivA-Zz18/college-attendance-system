import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // We can reuse the same CSS file!

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/attendance/me', {
          headers: { 'x-auth-token': token },
        });

        // Group the flat list of records by course
        const groupedByCourse = res.data.reduce((acc, record) => {
          const courseName = record.courseId.courseName;
          if (!acc[courseName]) {
            acc[courseName] = { records: [], present: 0, total: 0 };
          }
          acc[courseName].records.push(record);
          acc[courseName].total++;
          if (record.status === 'Present') {
            acc[courseName].present++;
          }
          return acc;
        }, {});

        setAttendanceData(groupedByCourse);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance', err);
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div>Loading attendance records...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div>
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      <main className="dashboard-content">
        <h2>Your Attendance Summary</h2>
        {Object.keys(attendanceData).length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          Object.entries(attendanceData).map(([courseName, data]) => {
            const percentage = data.total > 0 ? ((data.present / data.total) * 100).toFixed(1) : 0;
            return (
              <div key={courseName} className="course-summary-card">
                <h3>{courseName}</h3>
                <div className="percentage-display">
                  <strong>{percentage}%</strong>
                  <span>({data.present} / {data.total} classes attended)</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.records.map((record) => (
                      <tr key={record._id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td className={`status-${record.status.toLowerCase()}`}>{record.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

export default StudentDashboard;
