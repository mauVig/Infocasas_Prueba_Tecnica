import type { Exercise } from "../types/globalTypes";

const URL = 'http://127.0.0.1:8000/api/task';

const apiFetch = async (endpoint: string, options: RequestInit) => {
    let countRetries = 0;
    const maxRetries = 3;
    
    while (countRetries < maxRetries) {
        try {
            const response = await fetch(`${URL}${endpoint}`, options);
            if (!response.ok) {
                // Si la respuesta no es exitosa, lanza un error con el estado HTTP.
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            console.error('Failed to fetch:', error);
            countRetries++;
            
            if (countRetries === maxRetries) {
                throw new Error('Failed to fetch after multiple attempts');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    throw new Error('Failed to fetch after multiple attempts');
};


// 1. Obtener todas las tareas (GET)
export const getAllTasks = async (): Promise<Exercise[]> => {
    const response = await apiFetch('', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
};

export const getCompletedTasks = async (): Promise<Exercise[]> => {
    const response = await apiFetch('?completed=true', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
};

// 2. Crear una nueva tarea (POST)
export const createTask = async (name: string): Promise<Exercise> => {
    const response = await apiFetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ name }),
    });
    return await response.json();
};

// 3. Actualizar una tarea (PATCH)
export const updateTask = async (id: number, data: Partial<Exercise>): Promise<Exercise> => {
    const response = await apiFetch(`/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await response.json();
};

// 4. Eliminar una tarea (DELETE)
export const deleteTask = async (id: number): Promise<void> => {
    await apiFetch(`/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
        },
    });
    return;
};