import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, MoreVertical, Play, Eye, Trash2, Edit3, Sparkles, Code2, HeartPulse, Palette, Briefcase, Cpu, Lock, Camera } from 'lucide-react';
import { Course, User } from '../types';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { EditCourseModal } from '../components/EditCourseModal';
import { EditProfileModal } from '../components/EditProfileModal';

interface DashboardPageProps {
  user: User;
  courses: Course[];
  onRefreshCourses: () => void;
  onLogout: () => void;
  onUserUpdated?: (user: User) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  courses,
  onRefreshCourses,
  onLogout,
  onUserUpdated,
}) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch courses on mount
  useEffect(() => {
    onRefreshCourses();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health':
        return <HeartPulse className="w-3.5 h-3.5 text-rose-500" />;
      case 'creative':
        return <Palette className="w-3.5 h-3.5 text-amber-500" />;
      case 'business':
        return <Briefcase className="w-3.5 h-3.5 text-emerald-500" />;
      case 'technology':
        return <Cpu className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Code2 className="w-3.5 h-3.5 text-[#8150E8]" />;
    }
  };

  const handleDeleteCourse = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    if (window.confirm('Are you sure you want to delete this course?')) {
      const token = localStorage.getItem('coursestudio_token') || user.id;
      try {
        await fetch(`/api/courses/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        onRefreshCourses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditCourse = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setEditingCourse(course);
  };

  const handleSaveCourseEdits = async (title: string, description: string) => {
    if (editingCourse) {
      const token = localStorage.getItem('coursestudio_token') || user.id;
      try {
        await fetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        });
        onRefreshCourses();
        setEditingCourse(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <Sidebar
        courses={courses}
        user={user}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <Navbar
          user={user}
          onMenuToggle={() => setSidebarOpen(true)}
          showCreateButton={false}
          onEditProfile={() => setIsProfileModalOpen(true)}
        />

        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          {/* Header Row: Greeting with Photo & + Create AI Course button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => setIsProfileModalOpen(true)}
                title="Click to Change Photo"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-200 shadow-sm transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-sm transition-transform group-hover:scale-105"
                    style={{ backgroundColor: '#8150E8' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Hello, <span style={{ color: '#8150E8' }}>{user.name}</span>
                  </h1>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="text-xs text-[#8150E8] hover:text-[#6a3ec9] underline font-semibold transition-colors"
                  >
                    Change Photo
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Create new courses from topics or syllabus PDFs with locked lecture progression.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/create-course')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white rounded-xl shadow-xs transition-all hover:opacity-95 active:scale-95 shrink-0"
              style={{ backgroundColor: '#8150E8' }}
            >
              <Plus className="w-4 h-4" />
              <span>+ Create AI Course</span>
            </button>
          </div>

          {/* Section Heading */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              My AI Courses
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {courses.length} {courses.length === 1 ? 'course' : 'courses'} in studio
            </span>
          </div>

          {/* Courses Grid */}
          {courses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-12">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#8150E8] flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                No AI courses created yet
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Generate your first course with custom video lessons, notebook written assessments, and locked sequential chapters.
              </p>
              <button
                onClick={() => navigate('/create-course')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-transform active:scale-95"
                style={{ backgroundColor: '#8150E8' }}
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Your First Course</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const completedCount = course.chapters?.filter(c => c.completed)?.length || 0;
                const totalChapters = course.chapters?.length || course.noOfChapters || 5;

                return (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer relative"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-16/9 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={course.thumbnailUrl || '/src/assets/images/banner_sql_course_1794057965712.jpg'}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* PDF badge if generated from PDF */}
                      {course.pdfSources && course.pdfSources.length > 0 && (
                        <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/80 text-white backdrop-blur-xs border border-purple-400/40">
                          PDF Syllabus Evaluated
                        </span>
                      )}

                      {/* Three-dot menu button */}
                      <div className="absolute top-3 right-3 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === course.id ? null : course.id);
                          }}
                          className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors"
                          aria-label="Course Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === course.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95"
                          >
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                navigate(`/course/${course.id}`);
                              }}
                              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#8150E8] transition-colors text-left"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Course Layout</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                navigate(`/course/${course.id}/start`);
                              }}
                              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#8150E8] transition-colors text-left"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>Start Learning</span>
                            </button>

                            <button
                              onClick={(e) => handleEditCourse(course, e)}
                              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Details</span>
                            </button>

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              onClick={(e) => handleDeleteCourse(course.id, e)}
                              className="flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Course</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#8150E8] transition-colors line-clamp-1 mb-2">
                          {course.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                          {getCategoryIcon(course.category)}
                          <span className="font-medium">{course.category}</span>
                        </div>
                      </div>

                      <div>
                        {/* Progress bar */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                          <div
                            className="bg-[#8150E8] h-full rounded-full transition-all duration-300"
                            style={{ width: `${(completedCount / totalChapters) * 100}%` }}
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                            <BookOpen className="w-4 h-4 text-slate-400" />
                            <span>{completedCount}/{totalChapters} Lectures</span>
                          </div>

                          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                            {course.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <EditCourseModal
          isOpen={true}
          initialTitle={editingCourse.title}
          initialDescription={editingCourse.description}
          onClose={() => setEditingCourse(null)}
          onSave={handleSaveCourseEdits}
        />
      )}

      {/* Edit Profile & Photo Modal */}
      {isProfileModalOpen && (
        <EditProfileModal
          user={user}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onUserUpdated={(updatedUser) => {
            if (onUserUpdated) onUserUpdated(updatedUser);
          }}
        />
      )}
    </div>
  );
};
