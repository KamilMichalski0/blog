# React useState - Lazy Initialization

**Source:** Context7 - /reactjs/react.dev
**Last Updated:** 2025-01-24

## Lazy Initialization Pattern

useState can accept a function as its initial value. This function will only run once during the initial render, making it perfect for expensive computations.

### Basic Example

```javascript
import { useState } from 'react';

function Component() {
  // ❌ Bad: Runs on every render (even though value is only used once)
  const [state, setState] = useState(expensiveComputation());

  // ✅ Good: Only runs once during initial render
  const [state, setState] = useState(() => expensiveComputation());
}
```

## Dark Mode Toggle - Optimized

### Before (Without Lazy Initialization)

```typescript
export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // This runs AFTER initial render, causing an extra re-render
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    setIsDark(saved === 'dark' || (!saved && prefersDark));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
```

**Issues:**
- Initial render shows `false` (wrong state)
- useEffect runs, updates to correct state
- Causes unnecessary re-render
- Brief flash of wrong theme

### After (With Lazy Initialization)

```typescript
export function DarkModeToggle() {
  // ✅ Lazy initialization - runs only once
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    return saved === 'dark' || (!saved && prefersDark);
  });

  // Only one useEffect needed now
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
```

**Benefits:**
- ✅ Correct state from first render
- ✅ No unnecessary re-render
- ✅ No theme flash
- ✅ Cleaner code (one less useEffect)

## More Examples

### Client-Only Content

```javascript
function MyComponent() {
  // ✅ Lazy init for client-only logic
  const [didMount, setDidMount] = useState(() => {
    return typeof window !== 'undefined';
  });

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    return <ClientOnlyContent />;
  }
  return <ServerContent />;
}
```

### Reading from sessionStorage

```javascript
function Form() {
  // ✅ Only reads from storage once
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('formData');
    return saved ? JSON.parse(saved) : { name: '', email: '' };
  });

  // Save on changes
  useEffect(() => {
    sessionStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  return (/* form JSX */);
}
```

### Computing Initial State

```javascript
function TodoList({ items }) {
  // ✅ Heavy computation only runs once
  const [todos, setTodos] = useState(() => {
    return items
      .filter(item => item.active)
      .sort((a, b) => a.priority - b.priority)
      .map(item => ({ ...item, id: generateId() }));
  });

  return (/* todos JSX */);
}
```

## When to Use Lazy Initialization

Use lazy initialization when:

✅ Reading from localStorage/sessionStorage
✅ Reading from cookies
✅ Accessing browser APIs (window, navigator, etc.)
✅ Performing expensive computations
✅ Creating complex initial objects/arrays
✅ Generating unique IDs

Don't use for:

❌ Simple primitive values: `useState(0)`, `useState('')`, `useState(false)`
❌ When the value is already computed: `useState(props.value)`
❌ Simple object literals: `useState({})`, `useState([])`

## Performance Impact

```javascript
// ❌ Function runs on EVERY render
const [state, setState] = useState(expensiveFunction());

// ✅ Function runs ONLY on initial render
const [state, setState] = useState(() => expensiveFunction());

// ✅ For simple values, no function needed
const [count, setCount] = useState(0);
```

## Key Takeaways

1. **Pass a function** to useState when initialization is expensive
2. **The function runs only once** - during component mount
3. **No dependencies** - the function receives no arguments
4. **Improves performance** - avoids unnecessary computations
5. **Prevents visual bugs** - correct state from first render
