import { useState, useEffect, useCallback } from 'react'
import type { BookmarkCategory, Settings } from '../types'

const DEFAULT_CATEGORIES: BookmarkCategory[] = [
  {
    id: '1',
    name: 'Design',
    bookmarks: [
      { id: '1-1', title: 'Dribbble', url: 'https://dribbble.com' },
      { id: '1-2', title: 'Behance', url: 'https://behance.net' },
      { id: '1-3', title: 'Figma', url: 'https://figma.com' },
    ]
  },
  {
    id: '2',
    name: 'Dev',
    bookmarks: [
      { id: '2-1', title: 'GitHub', url: 'https://github.com' },
      { id: '2-2', title: 'Stack Overflow', url: 'https://stackoverflow.com' },
      { id: '2-3', title: 'MDN', url: 'https://developer.mozilla.org' },
    ]
  },
  {
    id: '3',
    name: 'Socials',
    bookmarks: [
      { id: '3-1', title: 'Twitter', url: 'https://twitter.com' },
      { id: '3-2', title: 'Reddit', url: 'https://reddit.com' },
      { id: '3-3', title: 'LinkedIn', url: 'https://linkedin.com' },
    ]
  },
  {
    id: '4',
    name: 'Entertainment',
    bookmarks: [
      { id: '4-1', title: 'YouTube', url: 'https://youtube.com' },
      { id: '4-2', title: 'Netflix', url: 'https://netflix.com' },
      { id: '4-3', title: 'Spotify', url: 'https://spotify.com' },
    ]
  },
]

const DEFAULT_SETTINGS: Settings = {
  userName: 'User',
  showGreeting: true,
  showClock: true,
  showWeather: false,
  showStatusBar: true,
  theme: 'carbon',
  clockFormat: '24h',
  bgDim: 40,
  bgBlur: 0,
  showDailyGoal: true,
  showGitHubStreak: false,
  githubUsername: '',
  asciiArt: `
  ⠀⠀⠀⠀⢠⡶⠚⢷⣤⡀⠀⠀⠀⠀⠀⣲⡶⠛⠻⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢠⡿⠁⠀⠀⠙⣷⣄⠀⢀⣴⡟⠁⠀⠀⢷⢹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣾⠃⠀⠠⠶⠚⠛⠛⠛⠛⠋⠀⠀⣀⡀⢸⠈⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢸⣏⡔⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠚⠉⠉⣿⠀⢹⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢾⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢠⣿⢠⣶⡆⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀
⢒⡾⠁⠘⠟⠁⠀⠀⠀⠀⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠉⣧⠀⠀⠀⠀⠃⠀⠀⠀⠈⠉⠠⣍⠀⠀⠀⠀⠀⠀⣸⡇⢀⣤⠶⠛⠛⠻⢦⣄
⠀⠸⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⡟⣴⠟⠁⠀⠀⠀⠀⠀⢻
⠀⠀⠀⠛⣷⡦⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣤⡴⠞⠋⢠⡟⠀⠀⠀⠀⠀⠀⢀⡾
⠀⠀⠀⢰⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠳⣤⡀⢸⠃⠀⠀⠀⠀⢠⡶⠟⠁
⠀⠀⠀⣸⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⣹⡄⠀⠀⠀⠀⣼⠀⠀⠀
⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣇⠀⠀⠀⠀⢹⡄⠀⠀
⠀⠀⠀⢸⡀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⡄⠀⠀⠀⠈⣧⠀⠀
⠀⠀⠀⢸⡇⠘⡇⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⢸⣿⠀⠀⠀⠀⢹⡇⠀
⠀⠀⠀⢸⡇⠀⠙⠀⠀⠀⠀⠀⢠⠞⠁⠀⠀⠀⠀⠀⠀⠀⣿⠇⠀⠀⠀⢸⡇⠀
⠀⠀⠀⢸⡇⠀⢸⡆⠀⠀⠀⠀⣟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠛⠀⠀⠀⠀⣸⠇⠀
⠀⠀⠀⢸⣿⠀⠀⡇⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⠀⢀⡇⠀⠀⢀⣴⡟⠁⠀
⠀⠀⠀⠘⠿⠶⢶⢧⣦⣦⡴⢾⣥⣽⣤⣤⣤⣤⣤⣤⡴⣯⡤⠴⠶⠛⠋⠀⠀⠀
`
}

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }, [key, value])

  return [value, setValue]
}

export function useBookmarks() {
  const [categories, setCategories] = useLocalStorage<BookmarkCategory[]>('startpage-bookmarks', DEFAULT_CATEGORIES)

  const addCategory = useCallback((name: string) => {
    setCategories(prev => [...prev, {
      id: crypto.randomUUID(),
      name,
      bookmarks: []
    }])
  }, [setCategories])

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id))
  }, [setCategories])

  const renameCategory = useCallback((id: string, name: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, name } : cat
    ))
  }, [setCategories])

  const addBookmark = useCallback((categoryId: string, title: string, url: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, bookmarks: [...cat.bookmarks, { id: crypto.randomUUID(), title, url }] }
        : cat
    ))
  }, [setCategories])

  const deleteBookmark = useCallback((categoryId: string, bookmarkId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, bookmarks: cat.bookmarks.filter(b => b.id !== bookmarkId) }
        : cat
    ))
  }, [setCategories])

  const editBookmark = useCallback((categoryId: string, bookmarkId: string, title: string, url: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, bookmarks: cat.bookmarks.map(b => 
            b.id === bookmarkId ? { ...b, title, url } : b
          )}
        : cat
    ))
  }, [setCategories])

  return {
    categories,
    addCategory,
    deleteCategory,
    renameCategory,
    addBookmark,
    deleteBookmark,
    editBookmark,
  }
}

export function useTime() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return time
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>('startpage-settings', DEFAULT_SETTINGS)
  return [settings, setSettings] as const
}
