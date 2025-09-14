import { useSelector } from 'react-redux';

const AuthDebugger = () => {
  const authState = useSelector(state => state.auth);
  const isProfileComplete = useSelector(state => state.auth.user?.isProfileComplete);
  
  const clearLocalStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.reload();
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: 'black',
      color: 'white',
      padding: '10px',
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <h4>Auth Debug Info:</h4>
      <div>Is Authenticated: {authState.isAuthenticated ? 'YES' : 'NO'}</div>
      <div>Is Loading: {authState.isLoading ? 'YES' : 'NO'}</div>
      <div>Has User: {authState.user ? 'YES' : 'NO'}</div>
      <div>Username: {authState.user?.username || 'None'}</div>
      <div>Role: {authState.user?.role || 'None'}</div>
      <div>Profile Complete: {isProfileComplete ? 'YES' : 'NO'}</div>
      <div>Profile Complete Value: {JSON.stringify(authState.user?.isProfileComplete)}</div>
      <hr />
      <div>LocalStorage Token: {localStorage.getItem('token') ? 'EXISTS' : 'MISSING'}</div>
      <div>LocalStorage User: {localStorage.getItem('user') ? 'EXISTS' : 'MISSING'}</div>
      <button 
        onClick={clearLocalStorage}
        style={{
          background: 'red',
          color: 'white',
          border: 'none',
          padding: '5px',
          margin: '5px 0',
          cursor: 'pointer'
        }}
      >
        Clear LocalStorage & Reload
      </button>
    </div>
  );
};

export default AuthDebugger;