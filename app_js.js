const { useState, useEffect } = React;

const StudyTracker = () => {
    const [subjects, setSubjects] = useState([]);
    const [studySessions, setStudySessions] = useState([]);
    const [activeTimer, setActiveTimer] = useState(null);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [currentView, setCurrentView] = useState('dashboard');
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [showAddSession, setShowAddSession] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);

    // Timer effect
    useEffect(() => {
        let interval = null;
        if (activeTimer) {
            interval = setInterval(() => {
                setTimerSeconds(seconds => seconds + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeTimer]);

    // Format time helper
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Add subject
    const addSubject = (subjectData) => {
        const newSubject = {
            id: Date.now(),
            ...subjectData,
            createdAt: new Date().toISOString()
        };
        setSubjects(prev => [...prev, newSubject]);
        setShowAddSubject(false);
    };

    // Edit subject
    const updateSubject = (id, updatedData) => {
        setSubjects(prev => prev.map(subject => 
            subject.id === id ? { ...subject, ...updatedData } : subject
        ));
        setEditingSubject(null);
    };

    // Delete subject
    const deleteSubject = (id) => {
        setSubjects(prev => prev.filter(subject => subject.id !== id));
        setStudySessions(prev => prev.filter(session => session.subjectId !== id));
    };

    // Timer functions
    const startTimer = (subjectId) => {
        setActiveTimer(subjectId);
        setTimerSeconds(0);
    };

    const pauseTimer = () => {
        setActiveTimer(null);
    };

    const stopTimer = () => {
        if (activeTimer && timerSeconds > 0) {
            const session = {
                id: Date.now(),
                subjectId: activeTimer,
                duration: timerSeconds,
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString()
            };
            setStudySessions(prev => [...prev, session]);
        }
        setActiveTimer(null);
        setTimerSeconds(0);
    };

    // Add manual session
    const addSession = (sessionData) => {
        const newSession = {
            id: Date.now(),
            ...sessionData,
            duration: sessionData.hours * 3600 + sessionData.minutes * 60,
            timestamp: new Date().toISOString()
        };
        setStudySessions(prev => [...prev, newSession]);
        setShowAddSession(false);
    };

    // Calculate statistics
    const getSubjectStats = (subjectId) => {
        const sessions = studySessions.filter(s => s.subjectId === subjectId);
        const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
        const sessionsToday = sessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length;
        const totalSessions = sessions.length;
        
        return { totalTime, sessionsToday, totalSessions };
    };

    // Get overall statistics
    const getOverallStats = () => {
        const totalTime = studySessions.reduce((sum, s) => sum + s.duration, 0);
        const today = new Date().toISOString().split('T')[0];
        const timeToday = studySessions.filter(s => s.date === today).reduce((sum, s) => sum + s.duration, 0);
        const sessionsToday = studySessions.filter(s => s.date === today).length;
        
        return { totalTime, timeToday, sessionsToday };
    };

    // Subject Form Component
    const SubjectForm = ({ subject, onSubmit, onCancel }) => {
        const [formData, setFormData] = useState({
            name: subject?.name || '',
            color: subject?.color || '#3b82f6',
            goal: subject?.goal || 60,
            description: subject?.description || ''
        });

        const handleSubmit = () => {
            if (formData.name.trim()) {
                onSubmit(formData);
            }
        };

        return React.createElement('div', {
            className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop"
        }, React.createElement('div', {
            className: "bg-white rounded-xl p-6 w-full max-w-md card"
        }, [
            React.createElement('h3', {
                key: 'title',
                className: "text-xl font-bold mb-4"
            }, subject ? 'Edit Subject' : 'Add New Subject'),
            
            React.createElement('div', {
                key: 'form',
                className: "space-y-4"
            }, [
                // Subject Name
                React.createElement('div', { key: 'name' }, [
                    React.createElement('label', {
                        key: 'name-label',
                        className: "block text-sm font-medium mb-1"
                    }, 'Subject Name'),
                    React.createElement('input', {
                        key: 'name-input',
                        type: "text",
                        value: formData.name,
                        onChange: (e) => setFormData({...formData, name: e.target.value}),
                        className: "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                
                // Color
                React.createElement('div', { key: 'color' }, [
                    React.createElement('label', {
                        key: 'color-label',
                        className: "block text-sm font-medium mb-1"
                    }, 'Color'),
                    React.createElement('input', {
                        key: 'color-input',
                        type: "color",
                        value: formData.color,
                        onChange: (e) => setFormData({...formData, color: e.target.value}),
                        className: "w-full h-10 border rounded-lg cursor-pointer"
                    })
                ]),
                
                // Goal
                React.createElement('div', { key: 'goal' }, [
                    React.createElement('label', {
                        key: 'goal-label',
                        className: "block text-sm font-medium mb-1"
                    }, 'Daily Goal (minutes)'),
                    React.createElement('input', {
                        key: 'goal-input',
                        type: "number",
                        value: formData.goal,
                        onChange: (e) => setFormData({...formData, goal: parseInt(e.target.value)}),
                        className: "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                        min: "1"
                    })
                ]),
                
                // Description
                React.createElement('div', { key: 'description' }, [
                    React.createElement('label', {
                        key: 'desc-label',
                        className: "block text-sm font-medium mb-1"
                    }, 'Description (optional)'),
                    React.createElement('textarea', {
                        key: 'desc-input',
                        value: formData.description,
                        onChange: (e) => setFormData({...formData, description: e.target.value}),
                        className: "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                        rows: "3"
                    })
                ]),
                
                // Buttons
                React.createElement('div', {
                    key: 'buttons',
                    className: "flex gap-3"
                }, [
                    React.createElement('button', {
                        key: 'submit',
                        onClick: handleSubmit,
                        className: "flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    }, subject ? 'Update Subject' : 'Add Subject'),
                    React.createElement('button', {
                        key: 'cancel',
                        onClick: onCancel,
                        className: "flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    }, 'Cancel')
                ])
            ])
        ]));
    };

    // Session Form Component
    const SessionForm = ({ onSubmit, onCancel }) => {
        const [formData, setFormData] = useState({
            subjectId: subjects[0]?.id || '',
            date: new Date().toISOString().split('T')[0],
            hours: 0,
            minutes: 30
        });

        const handleSubmit = () => {
            if ((formData.hours > 0 || formData.minutes > 0) && formData.subjectId) {
                onSubmit(formData);
            }
        };

        return React.createElement('div', {
            className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-backdrop"
        }, React.createElement('div', {
            className: "bg-white rounded-xl p-6 w-full max-w-md card"
        }, [
            React.createElement('h3', {
                key: 'title',
                className: "text-xl font-bold mb-4"
            }, 'Add Study Session'),
            
            React.createElement('div', {
                key: 'form',
                className: "space-y-4"
            }, [
                // Subject Selection
                React.createElement('div', { key: 'subject' }, [
                    React.createElement('label', {
                        key: 'subject-label',
                        className: "block text-sm font-medium mb-1"
                    }, 'Subject'),
                    React.createElement('select', {
                        key: 'subject-select',
                        value: formData.subjectId,
                        onChange: (e) => setFormData({...formData, subjectId: parseInt(e.target.value)}),
                        className: "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }, subjects.map(subject => 
                        React.createElement('option', {
                            key: subject.id,
                            value: subject.id
                        }, subject.name)
                    ))
                ]),
                
                // Date
                React.createElement('div', { key: 'date' }, [
                    React.createElement('label', {
                        key: 'date-label',
                        className: "block text-sm font-medium mb-1"
                    }, 'Date'),
                    React.createElement('input', {
                        key: 'date-input',
                        type: "date",
                        value: formData.date,
                        onChange: (e) => setFormData({...formData, date: e.target.value}),
                        className: "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    })
                ]),
                
                // Time Duration
                React.createElement('div', {
                    key: 'duration',
                    className: "grid grid-cols-2 gap-3"
                }, [
                    React.createElement('div', { key: 'hours' }, [
                        React.createElement('label', {
                            key: 'hours-label',
                            className: "block text-sm font-medium mb-1"
                        }, 'Hours'),
                        React.createElement('input', {
                            key: 'hours-input',
                            type: "number",
                            value: formData.hours,
                            onChange: (e) => setFormData({...formData, hours: parseInt(e.target.value) || 0}),
                            className: "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                            min: "0",
                            max: "12"
                        })
                    ]),
                    React.createElement('div', { key: 'minutes' }, [
                        React.createElement('label', {
                            key: 'minutes-label',
                            className: "block text-sm font-medium mb-1"
                        }, 'Minutes'),
                        React.createElement('input', {
                            key: 'minutes-input',
                            type: "number",
                            value: formData.minutes,
                            onChange: (e) => setFormData({...formData, minutes: parseInt(e.target.value) || 0}),
                            className: "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                            min: "0",
                            max: "59"
                        })
                    ])
                ]),
                
                // Buttons
                React.createElement('div', {
                    key: 'buttons',
                    className: "flex gap-3"
                }, [
                    React.createElement('button', {
                        key: 'submit',
                        onClick: handleSubmit,
                        className: "flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    }, 'Add Session'),
                    React.createElement('button', {
                        key: 'cancel',
                        onClick: onCancel,
                        className: "flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    }, 'Cancel')
                ])
            ])
        ]));
    };

    const overallStats = getOverallStats();

    // Main App Structure
    return React.createElement('div', {
        className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
    }, [
        React.createElement('div', {
            key: 'main-container',
            className: "container mx-auto px-4 py-8 max-w-7xl"
        }, [
            // Header
            React.createElement('div', {
                key: 'header',
                className: "mb-8"
            }, [
                React.createElement('h1', {
                    key: 'title',
                    className: "text-4xl font-bold text-gray-900 mb-2"
                }, 'Study Tracker'),
                React.createElement('p', {
                    key: 'subtitle',
                    className: "text-gray-600"
                }, 'Track your study sessions and achieve your learning goals')
            ]),

            // Navigation
            React.createElement('div', {
                key: 'navigation',
                className: "bg-white rounded-xl shadow-sm border mb-6 card"
            }, React.createElement('div', {
                className: "flex flex-wrap gap-1 p-2"
            }, ['dashboard', 'subjects', 'sessions', 'analytics'].map(view =>
                React.createElement('button', {
                    key: view,
                    onClick: () => setCurrentView(view),
                    className: `px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                        currentView === view 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-600 hover:bg-gray-100'
                    }`
                }, view)
            ))),

            // Dashboard View
            currentView === 'dashboard' && React.createElement('div', {
                key: 'dashboard',
                className: "space-y-6"
            }, [
                // Stats Cards
                React.createElement('div', {
                    key: 'stats',
                    className: "grid md:grid-cols-3 gap-6"
                }, [
                    // Today's Study Time
                    React.createElement('div', {
                        key: 'today-time',
                        className: "bg-white rounded-xl p-6 shadow-sm border card"
                    }, React.createElement('div', {
                        className: "flex items-center gap-3"
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: "p-3 bg-blue-100 rounded-lg"
                        }, React.createElement(Icons.Clock, { className: "w-6 h-6 text-blue-600" })),
                        React.createElement('div', { key: 'content' }, [
                            React.createElement('p', {
                                key: 'label',
                                className: "text-sm text-gray-600"
                            }, "Today's Study Time"),
                            React.createElement('p', {
                                key: 'value',
                                className: "text-2xl font-bold text-gray-900"
                            }, `${Math.floor(overallStats.timeToday / 3600)}h ${Math.floor((overallStats.timeToday % 3600) / 60)}m`)
                        ])
                    ])),

                    // Sessions Today
                    React.createElement('div', {
                        key: 'sessions-today',
                        className: "bg-white rounded-xl p-6 shadow-sm border card"
                    }, React.createElement('div', {
                        className: "flex items-center gap-3"
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: "p-3 bg-green-100 rounded-lg"
                        }, React.createElement(Icons.BookOpen, { className: "w-6 h-6 text-green-600" })),
                        React.createElement('div', { key: 'content' }, [
                            React.createElement('p', {
                                key: 'label',
                                className: "text-sm text-gray-600"
                            }, "Sessions Today"),
                            React.createElement('p', {
                                key: 'value',
                                className: "text-2xl font-bold text-gray-900"
                            }, overallStats.sessionsToday)
                        ])
                    ])),

                    // Total Study Time
                    React.createElement('div', {
                        key: 'total-time',
                        className: "bg-white rounded-xl p-6 shadow-sm border card"
                    }, React.createElement('div', {
                        className: "flex items-center gap-3"
                    }, [
                        React.createElement('div', {
                            key: 'icon',
                            className: "p-3 bg-purple-100 rounded-lg"
                        }, React.createElement(Icons.TrendingUp, { className: "w-6 h-6 text-purple-600" })),
                        React.createElement('div', { key: 'content' }, [
                            React.createElement('p', {
                                key: 'label',
                                className: "text-sm text-gray-600"
                            }, "Total Study Time"),
                            React.createElement('p', {
                                key: 'value',
                                className: "text-2xl font-bold text-gray-900"
                            }, `${Math.floor(overallStats.totalTime / 3600)}h ${Math.floor((overallStats.totalTime % 3600) / 60)}m`)
                        ])
                    ]))
                ]),

                // Active Timer
                activeTimer && React.createElement('div', {
                    key: 'active-timer',
                    className: "bg-white rounded-xl p-6 shadow-sm border card"
                }, React.createElement('div', {
                    className: "flex items-center justify-between"
                }, [
                    React.createElement('div', {
                        key: 'timer-info',
                        className: "flex items-center gap-4"
                    }, [
                        React.createElement('div', {
                            key: 'pulse',
                            className: "w-4 h-4 bg-red-500 rounded-full animate-pulse"
                        }),
                        React.createElement('div', { key: 'timer-content' }, [
                            React.createElement('h3', {
                                key: 'subject-name',
                                className: "text-lg font-semibold"
                            }, `Studying: ${subjects.find(s => s.id === activeTimer)?.name}`),
                            React.createElement('p', {
                                key: 'time-display',
                                className: "text-3xl font-mono font-bold text-blue-600"
                            }, formatTime(timerSeconds))
                        ])
                    ]),
                    React.createElement('div', {
                        key: 'timer-controls',
                        className: "flex gap-2"
                    }, [
                        React.createElement('button', {
                            key: 'pause',
                            onClick: pauseTimer,
                            className: "p-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                        }, React.createElement(Icons.Pause, { className: "w-5 h-5" })),
                        React.createElement('button', {
                            key: 'stop',
                            onClick: stopTimer,
                            className: "p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        }, React.createElement(Icons.Square, { className: "w-5 h-5" }))
                    ])
                ])),

                // Subjects Quick View
                React.createElement('div', {
                    key: 'subjects-overview',
                    className: "bg-white rounded-xl p-6 shadow-sm border card"
                }, [
                    React.createElement('div', {
                        key: 'subjects-header',
                        className: "flex items-center justify-between mb-4"
                    }, [
                        React.createElement('h2', {
                            key: 'title',
                            className: "text-xl font-semibold"
                        }, 'Your Subjects'),
                        React.createElement('button', {
                            key: 'add-btn',
                            onClick: () => setShowAddSubject(true),
                            className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        }, [
                            React.createElement(Icons.Plus, { key: 'icon', className: "w-4 h-4" }),
                            'Add Subject'
                        ])
                    ]),

                    subjects.length === 0 ? 
                        React.createElement('div', {
                            key: 'no-subjects',
                            className: "text-center py-12"
                        }, [
                            React.createElement(Icons.BookOpen, {
                                key: 'icon',
                                className: "w-16 h-16 text-gray-300 mx-auto mb-4"
                            }),
                            React.createElement('p', {
                                key: 'text',
                                className: "text-gray-500 mb-4"
                            }, 'No subjects added yet'),
                            React.createElement('button', {
                                key: 'add-first',
                                onClick: () => setShowAddSubject(true),
                                className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            }, 'Add Your First Subject')
                        ]) :
                        React.createElement('div', {
                            key: 'subjects-grid',
                            className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                        }, subjects.map(subject => {
                            const stats = getSubjectStats(subject.id);
                            const goalProgress = (stats.totalTime / (subject.goal * 60)) * 100;
                            
                            return React.createElement('div', {
                                key: subject.id,
                                className: "border rounded-lg p-4 hover:shadow-md transition-shadow card"
                            }, [
                                React.createElement('div', {
                                    key: 'subject-header',
                                    className: "flex items-center gap-3 mb-3"
                                }, [
                                    React.createElement('div', {
                                        key: 'color',
                                        className: "w-4 h-4 rounded-full",
                                        style: { backgroundColor: subject.color }
                                    }),
                                    React.createElement('h3', {
                                        key: 'name',
                                        className: "font-semibold flex-1"
                                    }, subject.name),
                                    !activeTimer && React.createElement('button', {
                                        key: 'play-btn',
                                        onClick: () => startTimer(subject.id),
                                        className: "p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                    }, React.createElement(Icons.Play, { className: "w-4 h-4" }))
                                ]),
                                React.createElement('div', {
                                    key: 'subject-stats',
                                    className: "space-y-2"
                                }, [
                                    React.createElement('div', {
                                        key: 'goal-text',
                                        className: "flex justify-between text-sm"
                                    }, [
                                        React.createElement('span', { key: 'label' }, "Today's Goal"),
                                        React.createElement('span', { key: 'value' }, `${Math.floor(stats.totalTime / 60)}/${subject.goal} min`)
                                    ]),
                                    React.createElement('div', {
                                        key: 'progress-bar',
                                        className: "w-full bg-gray-200 rounded-full h-2"
                                    }, React.createElement('div', {
                                        className: "bg-blue-600 h-2 rounded-full transition-all",
                                        style: { width: `${Math.min(goalProgress, 100)}%` }
                                    })),
                                    React.createElement('p', {
                                        key: 'summary',
                                        className: "text-xs text-gray-500"
                                    }, `${stats.totalSessions} sessions • ${Math.floor(stats.totalTime / 3600)}h ${Math.floor((stats.totalTime % 3600) / 60)}m total`)
                                ])
                            ]);
                        }))
                ])
            ]),

            // Subjects View
            currentView === 'subjects' && React.createElement('div', {
                key: 'subjects-view',
                className: "bg-white rounded-xl p-6 shadow-sm border card"
            }, [
                React.createElement('div', {
                    key: 'subjects-header',
                    className: "flex items-center justify-between mb-6"
                }, [
                    React.createElement('h2', {
                        key: 'title',
                        className: "text-2xl font-semibold"
                    }, 'Manage Subjects'),
                    React.createElement('button', {
                        key: 'add-btn',
                        onClick: () => setShowAddSubject(true),
                        className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    }, [
                        React.createElement(Icons.Plus, { key: 'icon', className: "w-4 h-4" }),
                        'Add Subject'
                    ])
                ]),

                subjects.length === 0 ?
                    React.createElement('div', {
                        key: 'empty-state',
                        className: "text-center py-12"
                    }, [
                        React.createElement(Icons.BookOpen, {
                            key: 'icon',
                            className: "w-16 h-16 text-gray-300 mx-auto mb-4"
                        }),
                        React.createElement('p', {
                            key: 'text',
                            className: "text-gray-500"
                        }, 'No subjects added yet')
                    ]) :
                    React.createElement('div', {
                        key: 'subjects-list',
                        className: "space-y-4"
                    }, subjects.map(subject => {
                        const stats = getSubjectStats(subject.id);
                        
                        return React.createElement('div', {
                            key: subject.id,
                            className: "border rounded-lg p-6 card"
                        }, React.createElement('div', {
                            className: "flex items-start justify-between"
                        }, [
                            React.createElement('div', {
                                key: 'subject-info',
                                className: "flex items-center gap-4 flex-1"
                            }, [
                                React.createElement('div', {
                                    key: 'color',
                                    className: "w-6 h-6 rounded-full",
                                    style: { backgroundColor: subject.color }
                                }),
                                React.createElement('div', {
                                    key: 'details',
                                    className: "flex-1"
                                }, [
                                    React.createElement('h3', {
                                        key: 'name',
                                        className: "text-lg font-semibold"
                                    }, subject.name),
                                    subject.description && React.createElement('p', {
                                        key: 'description',
                                        className: "text-gray-600 mt-1"
                                    }, subject.description),
                                    React.createElement('div', {
                                        key: 'stats',
                                        className: "flex items-center gap-4 mt-3 text-sm text-gray-500"
                                    }, [
                                        React.createElement('span', { key: 'goal' }, `Goal: ${subject.goal} min/day`),
                                        React.createElement('span', { key: 'total' }, `Total: ${Math.floor(stats.totalTime / 3600)}h ${Math.floor((stats.totalTime % 3600) / 60)}m`),
                                        React.createElement('span', { key: 'sessions' }, `${stats.totalSessions} sessions`)
                                    ])
                                ])
                            ]),
                            React.createElement('div', {
                                key: 'actions',
                                className: "flex items-center gap-2"
                            }, [
                                !activeTimer && React.createElement('button', {
                                    key: 'start',
                                    onClick: () => startTimer(subject.id),
                                    className: "p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                }, React.createElement(Icons.Play, { className: "w-4 h-4" })),
                                React.createElement('button', {
                                    key: 'edit',
                                    onClick: () => setEditingSubject(subject),
                                    className: "p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                }, React.createElement(Icons.Edit, { className: "w-4 h-4" })),
                                React.createElement('button', {
                                    key: 'delete',
                                    onClick: () => deleteSubject(subject.id),
                                    className: "p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                }, React.createElement(Icons.Trash2, { className: "w-4 h-4" }))
                            ])
                        ]));
                    }))
            ]),

            // Sessions View
            currentView === 'sessions' && React.createElement('div', {
                key: 'sessions-view',
                className: "bg-white rounded-xl p-6 shadow-sm border card"
            }, [
                React.createElement('div', {
                    key: 'sessions-header',
                    className: "flex items-center justify-between mb-6"
                }, [
                    React.createElement('h2', {
                        key: 'title',
                        className: "text-2xl font-semibold"
                    }, 'Study Sessions'),
                    React.createElement('button', {
                        key: 'add-btn',
                        onClick: () => setShowAddSession(true),
                        disabled: subjects.length === 0,
                        className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    }, [
                        React.createElement(Icons.Plus, { key: 'icon', className: "w-4 h-4" }),
                        'Add Session'
                    ])
                ]),

                studySessions.length === 0 ?
                    React.createElement('div', {
                        key: 'empty-sessions',
                        className: "text-center py-12"
                    }, [
                        React.createElement(Icons.Calendar, {
                            key: 'icon',
                            className: "w-16 h-16 text-gray-300 mx-auto mb-4"
                        }),
                        React.createElement('p', {
                            key: 'text',
                            className: "text-gray-500"
                        }, 'No study sessions recorded yet')
                    ]) :
                    React.createElement('div', {
                        key: 'sessions-list',
                        className: "space-y-3"
                    }, studySessions
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .slice(0, 20)
                        .map(session => {
                            const subject = subjects.find(s => s.id === session.subjectId);
                            return React.createElement('div', {
                                key: session.id,
                                className: "flex items-center justify-between p-4 border rounded-lg card"
                            }, [
                                React.createElement('div', {
                                    key: 'session-info',
                                    className: "flex items-center gap-4"
                                }, [
                                    React.createElement('div', {
                                        key: 'color',
                                        className: "w-4 h-4 rounded-full",
                                        style: { backgroundColor: subject?.color || '#gray' }
                                    }),
                                    React.createElement('div', { key: 'details' }, [
                                        React.createElement('h4', {
                                            key: 'subject',
                                            className: "font-medium"
                                        }, subject?.name || 'Deleted Subject'),
                                        React.createElement('p', {
                                            key: 'date',
                                            className: "text-sm text-gray-600"
                                        }, session.date)
                                    ])
                                ]),
                                React.createElement('div', {
                                    key: 'session-time',
                                    className: "text-right"
                                }, [
                                    React.createElement('p', {
                                        key: 'duration',
                                        className: "font-medium"
                                    }, `${Math.floor(session.duration / 3600)}h ${Math.floor((session.duration % 3600) / 60)}m`),
                                    React.createElement('p', {
                                        key: 'time',
                                        className: "text-sm text-gray-500"
                                    }, new Date(session.timestamp).toLocaleTimeString())
                                ])
                            ]);
                        }))
            ]),

            // Analytics View
            currentView === 'analytics' && React.createElement('div', {
                key: 'analytics-view',
                className: "space-y-6"
            }, React.createElement('div', {
                className: "bg-white rounded-xl p-6 shadow-sm border card"
            }, [
                React.createElement('h2', {
                    key: 'title',
                    className: "text-2xl font-semibold mb-6"
                }, 'Study Analytics'),
                
                subjects.length === 0 ?
                    React.createElement('div', {
                        key: 'empty-analytics',
                        className: "text-center py-12"
                    }, [
                        React.createElement(Icons.TrendingUp, {
                            key: 'icon',
                            className: "w-16 h-16 text-gray-300 mx-auto mb-4"
                        }),
                        React.createElement('p', {
                            key: 'text',
                            className: "text-gray-500"
                        }, 'Add subjects and start studying to see analytics')
                    ]) :
                    React.createElement('div', {
                        key: 'analytics-grid',
                        className: "grid md:grid-cols-2 gap-6"
                    }, subjects.map(subject => {
                        const stats = getSubjectStats(subject.id);
                        const goalProgress = (stats.totalTime / (subject.goal * 60)) * 100;
                        
                        return React.createElement('div', {
                            key: subject.id,
                            className: "border rounded-lg p-6 card"
                        }, [
                            React.createElement('div', {
                                key: 'analytics-header',
                                className: "flex items-center gap-3 mb-4"
                            }, [
                                React.createElement('div', {
                                    key: 'color',
                                    className: "w-5 h-5 rounded-full",
                                    style: { backgroundColor: subject.color }
                                }),
                                React.createElement('h3', {
                                    key: 'name',
                                    className: "text-lg font-semibold"
                                }, subject.name)
                            ]),
                            
                            React.createElement('div', {
                                key: 'analytics-content',
                                className: "space-y-4"
                            }, [
                                React.createElement('div', { key: 'progress' }, [
                                    React.createElement('div', {
                                        key: 'progress-header',
                                        className: "flex justify-between text-sm mb-2"
                                    }, [
                                        React.createElement('span', { key: 'label' }, 'Daily Goal Progress'),
                                        React.createElement('span', { key: 'percent' }, `${Math.round(goalProgress)}%`)
                                    ]),
                                    React.createElement('div', {
                                        key: 'progress-bar',
                                        className: "w-full bg-gray-200 rounded-full h-3"
                                    }, React.createElement('div', {
                                        className: "bg-blue-600 h-3 rounded-full transition-all",
                                        style: { width: `${Math.min(goalProgress, 100)}%` }
                                    }))
                                ]),
                                
                                React.createElement('div', {
                                    key: 'stats-grid',
                                    className: "grid grid-cols-2 gap-4 text-center"
                                }, [
                                    React.createElement('div', {
                                        key: 'total-time',
                                        className: "bg-gray-50 rounded-lg p-3"
                                    }, [
                                        React.createElement('p', {
                                            key: 'time-value',
                                            className: "text-2xl font-bold text-blue-600"
                                        }, `${Math.floor(stats.totalTime / 3600)}h ${Math.floor((stats.totalTime % 3600) / 60)}m`),
                                        React.createElement('p', {
                                            key: 'time-label',
                                            className: "text-sm text-gray-600"
                                        }, 'Total Time')
                                    ]),
                                    React.createElement('div', {
                                        key: 'total-sessions',
                                        className: "bg-gray-50 rounded-lg p-3"
                                    }, [
                                        React.createElement('p', {
                                            key: 'sessions-value',
                                            className: "text-2xl font-bold text-green-600"
                                        }, stats.totalSessions),
                                        React.createElement('p', {
                                            key: 'sessions-label',
                                            className: "text-sm text-gray-600"
                                        }, 'Sessions')
                                    ])
                                ]),
                                
                                stats.totalSessions > 0 && React.createElement('div', {
                                    key: 'avg-session',
                                    className: "bg-gray-50 rounded-lg p-3 text-center"
                                }, [
                                    React.createElement('p', {
                                        key: 'avg-value',
                                        className: "text-lg font-bold text-purple-600"
                                    }, `${Math.round(stats.totalTime / stats.totalSessions / 60)} min`),
                                    React.createElement('p', {
                                        key: 'avg-label',
                                        className: "text-sm text-gray-600"
                                    }, 'Avg. Session Length')
                                ])
                            ])
                        ]);
                    }))
            ]))
        ]),

        // Modals
        showAddSubject && React.createElement(SubjectForm, {
            key: 'add-subject-modal',
            onSubmit: addSubject,
            onCancel: () => setShowAddSubject(false)
        }),

        editingSubject && React.createElement(SubjectForm, {
            key: 'edit-subject-modal',
            subject: editingSubject,
            onSubmit: (data) => updateSubject(editingSubject.id, data),
            onCancel: () => setEditingSubject(null)
        }),

        showAddSession && subjects.length > 0 && React.createElement(SessionForm, {
            key: 'add-session-modal',
            onSubmit: addSession,
            onCancel: () => setShowAddSession(false)
        })
    ]);
};

// Render the app
ReactDOM.render(React.createElement(StudyTracker), document.getElementById('root'));