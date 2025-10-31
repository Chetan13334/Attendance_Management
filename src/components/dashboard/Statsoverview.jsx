import React, { useEffect } from 'react';
import { UserCheck, UserX, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// 🆕 Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvents } from '../../redux/slices/eventSlice'; 

// ❌ Removed: Firebase imports (collection, getDocs, db)

const IconMap = {
    UserCheck,
    UserX,
    Clock,
    Calendar,
};

const StatCard = ({ title, value, icon: Icon, color, onClick }) => {
    const IconComponent = Icon ? IconMap[Icon.name] : null;

    const borderColor = {
        green: "border-green-500",
        red: "border-red-500",
        blue: "border-blue-500",
        yellow: "border-yellow-500",
    };

    const bgColor = {
        green: "bg-green-100 text-green-600",
        red: "bg-red-100 text-red-600",
        blue: "bg-blue-100 text-blue-600",
        yellow: "bg-yellow-100 text-yellow-600",
    };

    const gradientBg = {
        green: "from-green-200 to-green-100",
        red: "from-red-200 to-red-100",
        blue: "from-blue-200 to-blue-100",
        yellow: "from-yellow-100 to-yellow-50",
    };

    const shadowColor = {
        green: "shadow-green-100",
        red: "shadow-red-100",
        blue: "shadow-blue-100",
        yellow: "shadow-yellow-100",
    };

    return (
        <div
            className={`p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-between border border-gray-100 hover:border-${color}-200 cursor-pointer transform hover:-translate-y-1 ${shadowColor[color] || 'shadow-gray-100'}`}
            onClick={onClick}
        >
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
            {/* 🆕 Show '...' when loading events data, otherwise show value */}
                <p className="mt-1 text-3xl font-bold text-gray-900">
                    {value === '...' ? '...' : value}
                </p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientBg[color] || 'from-gray-400 to-gray-600'} text-white shadow-md`}>
                {IconComponent && <IconComponent className="w-6 h-6" />}
            </div>
        </div>
    );
};

function Statsoverview({ stats = [] }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 🆕 Get event list and loading state from Redux
    const events = useSelector((state) => state.events.list);
    const eventLoading = useSelector((state) => state.events.loading);
    
    // 🆕 Trigger event fetch on mount if data is not present
    useEffect(() => {
        if (events.length === 0 && !eventLoading) {
            dispatch(fetchEvents());
        }
    }, [dispatch, events.length, eventLoading]);

    const handleEventCardClick = () => {
        navigate('/events');
    };

    const eventCount = events.length;
    
    let currentStats;

    // Use default stats and replace the 'Events' card data
    const defaultStats = [
        { title: "Active Users", value: 1200, icon: UserCheck, color: "green" },
        { title: "Inactive Users", value: 80, icon: UserX, color: "red" },
        { title: "Clocked Hours", value: 56, icon: Clock, color: "blue" },
        { title: "Events", value: eventCount, icon: Calendar, color: "yellow", onClick: handleEventCardClick },
    ];

    if (!stats.length) {
        currentStats = defaultStats;
    } else {
        // Map provided stats and update 'Events' card
        currentStats = stats.map(stat => {
            if (stat.title === "Events") {
                return { 
                    ...stat, 
                    onClick: handleEventCardClick, 
                    value: eventCount 
                };
            }
            return stat;
        });
    }

    // 🆕 Handle Loading State for the Events card
    if (eventLoading && eventCount === 0) {
        const loadingStat = { title: "Events", value: '...', icon: Calendar, color: "yellow", onClick: handleEventCardClick };
        currentStats = currentStats.map(stat => stat.title === "Events" ? loadingStat : stat);
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentStats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
            ))}
        </div>
    );
}

export default Statsoverview;