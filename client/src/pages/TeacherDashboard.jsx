import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// A simple CSS file for styling the dashboard
import './Dashboard.css';

function TeacherDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // State management for our component
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'Present', ... }

  // --- 1. Fetch the teacher's courses when the component loads ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/courses/teacher', {
          headers: { 'x-auth-token': token },
        });
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses', err);
      }
    };
    fetchCourses();
  }, []); // Empty array means this runs once on component mount

  // --- 2. Fetch students when a course is selected ---
  useEffect(() => {
    if (selectedCourse) {
      const fetchStudents = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`/api/courses/${selectedCourse}/students`, {
            headers: { 'x-auth-token': token },
          });
          setStudents(res.data);
          // Reset attendance when course changes
          setAttendance({});
        } catch (err) {
          console.error('Error fetching students', err);
        }
      };
      fetchStudents();
    }
  }, [selectedCourse]); // This effect runs whenever selectedCourse changes

  // --- 3. Handler to update attendance state ---
  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  // --- 4. Handler to submit attendance to the backend ---
  const handleSubmitAttendance = async () => {
    if (Object.keys(attendance).length === 0) {
      return alert('Please mark attendance for at least one student.');
    }
    try {
      const token = localStorage.getItem('token');
      const attendanceData = Object.keys(attendance).map(studentId => ({
        student: studentId,
        status: attendance[studentId]
      }));

      await axios.post(`/api/attendance/${selectedCourse}`, { records: attendanceData }, {
        headers: { 'x-auth-token': token },
      });
      alert('Attendance submitted successfully!');
      setAttendance({}); // Reset for next time
    } catch (err) {
      console.error('Error submitting attendance', err);
      alert('Failed to submit attendance.');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div>
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="controls-container">
          <h2>Select a Course</h2>
          <select onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
            <option value="">-- Please choose a course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName} ({course.courseCode})
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <div className="student-list-container">
            <h3>Student List</h3>
            {students.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td className="attendance-buttons">
                        <button
                          className={`btn present ${attendance[student._id] === 'Present' ? 'active' : ''}`}
                          onClick={() => handleAttendanceChange(student._id, 'Present')}
                        >
                          Present
                        </button>
                        <button
                          className={`btn absent ${attendance[student._id] === 'Absent' ? 'active' : ''}`}
                          onClick={() => handleAttendanceChange(student._id, 'Absent')}
                        >
                          Absent
                        </button>
                        <button
                          className={`btn late ${attendance[student._id] === 'Late' ? 'active' : ''}`}
                          onClick={() => handleAttendanceChange(student._id, 'Late')}
                        >
                          Late
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No students enrolled in this course.</p>
            )}
             {students.length > 0 && (
                 <button onClick={handleSubmitAttendance} className="submit-attendance-btn">
                    Submit Attendance
                 </button>
             )}
          </div>
        )}
      </main>
    </div>
  );
}

export default TeacherDashboard;

