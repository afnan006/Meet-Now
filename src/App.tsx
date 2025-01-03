// // // import { useEffect } from 'react';
// // // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// // // import { onAuthStateChanged } from 'firebase/auth';
// // // import { auth } from './lib/firebase';
// // // import { useAuthStore } from './lib/store';
// // // import { AuthGuard } from './components/AuthGuard';
// // // import { Auth } from './pages/Auth';
// // // import { Dashboard } from './pages/Dashboard';
// // // import { Meeting } from './pages/Meeting';

// // // function App() {
// // //   const setUser = useAuthStore((state) => state.setUser);

// // //   useEffect(() => {
// // //     const unsubscribe = onAuthStateChanged(auth, (user) => {
// // //       setUser(user);
// // //     });

// // //     return () => unsubscribe();
// // //   }, [setUser]);

// // //   return (
// // //     <BrowserRouter>
// // //       <Routes>
// // //         <Route path="/auth" element={<Auth />} />
// // //         <Route
// // //           path="/dashboard"
// // //           element={
// // //             <AuthGuard>
// // //               <Dashboard />
// // //             </AuthGuard>
// // //           }
// // //         />
// // //         <Route
// // //           path="/meeting/:id"
// // //           element={
// // //             <AuthGuard>
// // //               <Meeting />
// // //             </AuthGuard>
// // //           }
// // //         />
// // //         <Route path="/" element={<Navigate to="/auth" replace />} />
// // //       </Routes>
// // //     </BrowserRouter>
// // //   );
// // // }
// // import { useEffect } from 'react';
// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// // import { onAuthStateChanged } from 'firebase/auth';
// // import { auth } from './lib/firebase';
// // import { useAuthStore } from './lib/store';
// // import { AuthGuard } from './components/AuthGuard';
// // import { Auth } from './pages/Auth';
// // import { Dashboard } from './pages/Dashboard';
// // import { Meeting } from './pages/Meeting';

// // function App() {
// //   const setUser = useAuthStore((state) => state.setUser);

// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, (user) => {
// //       setUser(user);
// //     });

// //     return () => unsubscribe();
// //   }, [setUser]);

// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route path="/auth" element={<Auth />} />
// //         <Route
// //           path="/dashboard"
// //           element={
// //             <AuthGuard>
// //               <Dashboard />
// //             </AuthGuard>
// //           }
// //         />
// //         <Route
// //           path="/meeting/:id"
// //           element={
// //             <AuthGuard>
// //               <Meeting />
// //             </AuthGuard>
// //           }
// //         />
// //         <Route path="/" element={<Navigate to="/auth" replace />} />
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;

// import { useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './lib/firebase';
// import { useAuthStore } from './lib/store';
// import { AuthGuard } from './components/AuthGuard';
// import { Auth } from './pages/Auth';
// import { Dashboard } from './pages/Dashboard';
// import { Meeting } from './pages/Meeting';

// function App() {
//   const setUser = useAuthStore((state) => state.setUser);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//     });

//     return () => unsubscribe();
//   }, [setUser]);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/auth" element={<Auth />} />
//         <Route
//           path="/dashboard"
//           element={
//             <AuthGuard>
//               <Dashboard />
//             </AuthGuard>
//           }
//         />
//         <Route
//           path="/meeting/:id"
//           element={
//             <AuthGuard>
//               <Meeting />
//             </AuthGuard>
//           }
//         />
//         <Route path="/" element={<Navigate to="/auth" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './lib/store';
import { AuthGuard } from './components/AuthGuard';
import  Auth  from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Meeting } from './pages/Meeting';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="flex justify-end p-4">
        <button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</button>
      </div>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/meeting/:id"
          element={
            <AuthGuard>
              <Meeting />
            </AuthGuard>
          }
        />
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;