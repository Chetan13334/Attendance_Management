import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

import Sidebar from "../components/common/Sidebar.jsx";
import Navbar from "../components/common/Navbar.jsx";
import AllEventsModal from "../components/common/AllEventsModal.jsx";
import Statsoverview from "../components/dashboard/Statsoverview.jsx";


const MOCK_USER = { uid: "mock-user-123", email: "test@user.com" };

const EventsPage = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Fetch events from Firebase
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, 'Events');
        const q = query(eventsRef, orderBy("event_date", "asc"));
        const querySnapshot = await getDocs(q);
        
        const fetchedEvents = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Event data from Firestore:", data); // Debug log
          
          // Handle Firebase timestamps properly
          const eventDate = data.event_date;
          const createdAt = data.created_at;
          
          // Process event_date
          let processedEventDate = null;
          if (eventDate) {
            if (eventDate.toDate) {
              processedEventDate = eventDate.toDate();
            } else if (typeof eventDate === 'string') {
              processedEventDate = new Date(eventDate);
            } else if (eventDate instanceof Date) {
              processedEventDate = eventDate;
            } else {
              processedEventDate = new Date(eventDate);
            }
          }
          
          // Process created_at
          let processedCreatedAt = null;
          if (createdAt) {
            if (createdAt.toDate) {
              processedCreatedAt = createdAt.toDate();
            } else if (typeof createdAt === 'string') {
              processedCreatedAt = new Date(createdAt);
            } else if (createdAt instanceof Date) {
              processedCreatedAt = createdAt;
            } else {
              processedCreatedAt = new Date(createdAt);
            }
          }
          
          return {
            id: doc.id,
            ...data,
            event_date: processedEventDate,
            created_at: processedCreatedAt
          };
        });
        
        console.log("Fetched events:", fetchedEvents); // Debug log
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
    
    setTimeout(() => {
      setUser(MOCK_USER);
    }, 500);
  }, []);

  const handleSignOut = () => {
    console.log("Mock sign out successful.");
    signOut(auth);
    navigate("/signin");
  };

  

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} handleSignOut={handleSignOut} />

      {/* Main content wrapper */}
      <div className="flex-1 lg:ml-64">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} handleSignOut={handleSignOut} />
        
        <main className="pt-20 px-4 sm:px-6 pb-8">
            <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <Statsoverview/>
        </div>

        
             
              <div className="mt-4">
              <AllEventsModal 
                isOpen={true} 
                onClose={() => navigate('/dashboard')} 
                events={events} 
              />
              </div>
            
        </main>
        
      </div>
    </div>
  );
};

export default EventsPage;