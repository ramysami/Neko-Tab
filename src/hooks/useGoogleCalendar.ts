import { useState, useEffect, useCallback } from 'react';

export interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string; // For all-day events
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  htmlLink: string;
}

export function useGoogleCalendar(enabled: boolean) {
  const [token, setToken] = useState<string | null>(null);
  const [event, setEvent] = useState<CalendarEvent | null>(() => {
    try {
      const cached = localStorage.getItem('neko-calendar-last-event');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !chrome.identity) return;

    chrome.identity.getAuthToken({ interactive: false }, (authToken) => {
      if (chrome.runtime.lastError) {
        localStorage.setItem('neko-calendar-connected', 'false');
        return;
      }
      if (authToken) {
        setToken(authToken as string);
        localStorage.setItem('neko-calendar-connected', 'true');
      }
    });
  }, [enabled]);

  // Method to manually connect (interactive)
  const connect = useCallback(() => {
    if (!chrome.identity) return;
    chrome.identity.getAuthToken({ interactive: true }, (authToken) => {
      if (chrome.runtime.lastError) {
        setError(chrome.runtime.lastError.message || 'Auth failed');
        return;
      }
      if (authToken) {
        setToken(authToken as string);
        localStorage.setItem('neko-calendar-connected', 'true');
        setError(null);
      }
    });
  }, []);

  // Method to disconnect
  const disconnect = useCallback(() => {
    if (!chrome.identity || !token) return;
    chrome.identity.removeCachedAuthToken({ token }, () => {
      setToken(null);
      setEvent(null);
      localStorage.setItem('neko-calendar-connected', 'false');
      localStorage.removeItem('neko-calendar-last-event');
    });
  }, [token]);

  // Fetch upcoming event when token is available
  useEffect(() => {
    if (!enabled) {
      setEvent(null);
      return;
    }
    
    // Don't clear the event if token is missing but we're still enabled
    // This preserves the cached event during the initial auth check
    if (!token) return;

    let isMounted = true;
    let timeoutId: number;

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const timeMin = new Date().toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&maxResults=1&singleEvents=true&orderBy=startTime`;
        
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          chrome.identity.removeCachedAuthToken({ token }, () => {
            if (isMounted) setToken(null);
          });
          throw new Error('Unauthorized');
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || `Failed to fetch events: ${response.status}`);
        }

        if (isMounted) {
          const newEvent = data.items?.[0] || null;
          setEvent(newEvent);
          if (newEvent) {
            localStorage.setItem('neko-calendar-last-event', JSON.stringify(newEvent));
          } else {
            localStorage.removeItem('neko-calendar-last-event');
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }

      // Refetch every 5 minutes
      if (isMounted) {
        timeoutId = window.setTimeout(fetchEvent, 5 * 60 * 1000);
      }
    };

    fetchEvent();

    return () => {
      isMounted = false;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [token, enabled]);

  return {
    token,
    isConnected: !!token,
    connect,
    disconnect,
    event,
    loading,
    error
  };
}
