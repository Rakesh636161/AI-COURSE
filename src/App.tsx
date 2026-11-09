/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateCourseWizard } from './pages/CreateCourseWizard';
import { CourseLayoutPage } from './pages/CourseLayoutPage';
import { CourseLearningPage } from './pages/CourseLearningPage';
import { ExplorePage } from './pages/ExplorePage';
import { User, Course } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('coursestudio_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Default demo user so testing is smooth
    return {
      id: 'user_default_1',
      name: 'Student Learner',
      email: 'sagarn6363@gmail.com',
      coursesCreated: 3,
    };
  });

  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('coursestudio_token') || user?.id;
      if (!token || !user) {
        setCourses([]);
        return;
      }
      const res = await fetch('/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Failed fetching courses:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem('coursestudio_token');
    localStorage.removeItem('coursestudio_user');
    setUser(null);
    setCourses([]);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage user={user} />} />

        {/* Authentication Page (Email only + OTP Reset) */}
        <Route
          path="/auth"
          element={
            <AuthPage
              onLogin={(loggedInUser) => {
                setUser(loggedInUser);
                setTimeout(() => fetchCourses(), 50);
              }}
            />
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardPage
                user={user}
                courses={courses}
                onRefreshCourses={fetchCourses}
                onLogout={handleLogout}
                onUserUpdated={(updatedUser) => setUser(updatedUser)}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Explore Courses */}
        <Route
          path="/dashboard/explore"
          element={
            user ? (
              <ExplorePage
                user={user}
                courses={courses}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Create Course 3-Step Wizard with Multi-PDF Upload */}
        <Route
          path="/create-course"
          element={
            user ? (
              <CreateCourseWizard
                user={user}
                onCourseCreated={(newCourse) => {
                  fetchCourses();
                }}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Course Layout (Public / Shareable) */}
        <Route
          path="/course/:id"
          element={
            <CourseLayoutPage
              user={user}
              onRefreshCourses={fetchCourses}
            />
          }
        />
        <Route
          path="/create-course/:id"
          element={
            <CourseLayoutPage
              user={user}
              onRefreshCourses={fetchCourses}
            />
          }
        />

        {/* Interactive Course Learning Page with Locked Lectures & 75% Assessments */}
        <Route
          path="/course/:id/start"
          element={<CourseLearningPage />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
