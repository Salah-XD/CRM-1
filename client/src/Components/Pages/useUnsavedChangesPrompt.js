import { useEffect } from 'react';
import { useNavigate, useLocation, Prompt } from 'react-router-dom';

const useUnsavedChangesPrompt = (isDirty) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleNavigation = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome
        if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
          navigate(location.pathname, { replace: true }); // Proceed with navigation
        }
      }
    };

    window.addEventListener('beforeunload', handleNavigation);
    return () => {
      window.removeEventListener('beforeunload', handleNavigation);
    };
  }, [isDirty, navigate, location]);

  return;
};

export default useUnsavedChangesPrompt;
