// // src/components/FirebaseAuthListener.jsx

// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../firebase/firebaseConfig'; // Adjust path if needed
// import { logOut, setAuthReady } from '../features/auth/authSlice'; // Adjust path if needed

// const FirebaseAuthListener = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       // If Firebase reports the user is logged out, but we have a token in Redux,
//       // it means our stored state is stale. We must log out.
//       if (!user) {
//         dispatch(logOut());
//       }
      
//       // In all cases, once Firebase has given us an answer (user or null),
//       // we can signal that the initial authentication check is complete.
//       dispatch(setAuthReady());
//     });

//     return () => unsubscribe();
//   }, [dispatch]); 

//   return null; 
// };

// export default FirebaseAuthListener;