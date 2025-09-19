// Icon components for the Study Tracker
const Icons = {
    Plus: () => React.createElement('svg', {
        width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    }, React.createElement('path', { d: "M12 5v14M5 12h14" })),

    Clock: () => React.createElement('svg', {
        width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    }, 
        React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
        React.createElement('polyline', { points: "12,6 12,12 16,14" })
    ),

    BookOpen: () => React.createElement('svg', {
        width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    }, 
        React.createElement('path', { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }),
        React.createElement('path', { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" })
    ),

    TrendingUp: () => React.createElement('svg', {
        width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    }, 
        React.createElement('polyline', { points: "23,6 13.5,15.5 8.5,10.5 1,18" }),
        React.createElement('polyline', { points: "17,6 23,6 23,12" })
    ),

    Calendar: () => React.createElement('svg', {
        width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    }, 
        React.createElement('rect', { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
        React.createElement('line', { x1: "16", y1: "2", x2: "16", y2: "6" }),
        React.createElement('line', { x1: "8", y1: "2", x2: "8", y2: "6" }),
        React.createElement('line', { x1: "3", y1: "10", x2: "21", y2: "10" })
    ),

    Target: () => React.createElement('svg', {
        width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    }, 
        React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
        React.createElement('circle', { cx: "12", cy: "12", r: "6" }),
        React.createElement('circle', { cx: "12", cy: "12", r: "2" })
    ),

    Edit: () => React.createElement('svg', {
        width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    }, 
        React.createElement('path', { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
        React.createElement('path', { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
    ),

    Trash2: () => React.createElement('svg', {
        width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    }, 
        React.createElement('polyline', { points: "3,6 5,6 21,6" }),
        React.createElement('path', { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
        React.createElement('line', { x1: "10", y1: "11", x2: "10", y2: "17" }),
        React.createElement('line', { x1: "14", y1: "11", x2: "14", y2: "17" })
    ),

    Play: () => React.createElement('svg', {
        width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    }, React.createElement('polygon', { points: "5,3 19,12 5,21" })),

    Pause: () => React.createElement('svg', {
        width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    }, 
        React.createElement('rect', { x: "6", y: "4", width: "4", height: "16" }),
        React.createElement('rect', { x: "14", y: "4", width: "4", height: "16" })
    ),

    Square: () => React.createElement('svg', {
        width: "24", height: "24", viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"
    }, React.createElement('rect', { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }))
};

// Make icons available globally
window.Icons = Icons;