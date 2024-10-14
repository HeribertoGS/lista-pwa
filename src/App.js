import { useReducer, useRef, useState, useEffect } from "react";
import './App.css';

function App() {
  const inputRef = useRef();
  const [tasks, dispatch] = useReducer((state = [], action) => {
    switch (action.type) {
      case 'add_task': {
        return [
          ...state,
          { id: state.length, title: action.title }
        ];
      }
      case 'remove_task': {
        return state.filter((task, index) => index !== action.index);
      }
      default: {
        return state;
      }
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({
      type: 'add_task',
      title: inputRef.current.value
    });
    inputRef.current.value = '';
  }

  // Agregado para beforeinstallprompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-zinc-800 mb-6 text-center">Lista de tareas</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
        <div className="mb-4">
          <input type="text" name="title" ref={inputRef} className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm" placeholder="" />
        </div>
        <button type="submit" className="w-full bg-indigo-300 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-600">
          Enviar
        </button>
      </form>
      <div className="tasks max-w-md mx-auto mt-6">
        {tasks && tasks.map((task, index) => (
          <div className="task flex items-center justify-between bg-blue-100 p-4 mb-2 rounded-md shadow-sm" key={index}>
            <p className="text-gray-700">{task.title}</p>
            <button onClick={() => dispatch({ type: 'remove_task', index })} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
              Borrar
            </button>
          </div>
        ))}
      </div>

      {/* Botón de instalación PWA */}
      {deferredPrompt && (
        <div className="install-button max-w-md mx-auto mt-6 text-center">
          <button onClick={handleInstallClick} className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600">
            Instalar PWA
          </button>
        </div>
      )}
    </>
  );
}

export default App;
