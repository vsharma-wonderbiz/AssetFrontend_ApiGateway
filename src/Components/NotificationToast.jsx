// import { useEffect, useState } from "react";
// import * as signalR from "@microsoft/signalr";

// const NotificationToast = () => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     const connection = new signalR.HubConnectionBuilder()
//       .withUrl("https://localhost:7285/notify", {
//         accessTokenFactory: () => localStorage.getItem("token"),
//         withCredentials: true
//       })
//       .withAutomaticReconnect()
//       .build();

//     connection.start()
//       .then(() => console.log("✅ Connected to SignalR Hub"))
//       .catch(err => console.error("❌ Error connecting:", err));

//     connection.on("ReceiveNotification", (message) => {
//         console.log(message)
//       const id = Date.now(); // unique id for each notification
//       setNotifications(prev => [...prev, { id, message }]);

//       // Remove after 3 seconds
//       setTimeout(() => {
//         setNotifications(prev => prev.filter(n => n.id !== id));
//       }, 3000);
//     });

//     return () => {
//       connection.stop();
//     };
//   }, []);

//   return (
//     <div style={{
//       position: "fixed",
//       bottom: "20px",
//       right: "20px",
//       display: "flex",
//       flexDirection: "column",
//       gap: "10px",
//       zIndex: 9999
//     }}>
//       {notifications.map(n => (
//         <div key={n.id} style={{
//           background: "#333",
//           color: "#fff",
//           padding: "10px 20px",
//           borderRadius: "8px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
//           opacity: 0.9,
//           transition: "all 0.5s"
//         }}>
//           {n.message}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default NotificationToast;

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const NotificationToast = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7285/notify", { // HTTP instead of HTTPS
        accessTokenFactory: () => localStorage.getItem("token"),
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log("✅ Connected to SignalR Hub");
        console.log("Connection State:", connection.state);
      })
      .catch(err => console.error("❌ Error connecting:", err));

    connection.on("ReceiveNotification", (message) => {
      console.log("📢 Received notification:", message);
      
      const id = Date.now();
      const newNotification = { id, message };
      
      console.log("Adding notification:", newNotification);
      
      setNotifications(prev => {
        console.log("Previous notifications:", prev);
        const updated = [...prev, newNotification];
        console.log("Updated notifications:", updated);
        return updated;
      });

      // Remove after 5 seconds (increased time for testing)
      setTimeout(() => {
        console.log("Removing notification with id:", id);
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    });

    return () => {
      connection.stop();
    };
  }, []);

  // Add debug logging
  console.log("Current notifications state:", notifications);

  return (
    <>
      {/* Debug info */}
      <div style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: "yellow",
        padding: "5px",
        fontSize: "12px",
        zIndex: 10000
      }}>
        Notifications: {notifications.length}
      </div>

      {/* Notification container */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999,
        maxWidth: "300px"
      }}>
        {notifications.length > 0 && console.log("Rendering notifications:", notifications)}
        {notifications.map(n => (
          <div key={n.id} style={{
            background: "#333",
            color: "#fff",
            padding: "15px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            opacity: 1,
            transform: "translateX(0)",
            transition: "all 0.3s ease-in-out",
            border: "2px solid #555",
            fontSize: "14px",
            lineHeight: "1.4"
          }}>
            {n.message}
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationToast;
