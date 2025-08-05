import axios from 'axios';

const API_BASE = 'http://localhost:3001';

export const getTasks = () => axios.get(`${API_BASE}/tasks`).then(res => res.data);
export const addTask = (title, userType, createdBy) => axios.post(`${API_BASE}/tasks`, { title, userType, createdBy }).then(res => res.data);
export const updateTask = (id, updates) => axios.put(`${API_BASE}/tasks/${id}`, updates).then(res => res.data);
export const updateTaskStatus = (id, status) => axios.put(`${API_BASE}/tasks/${id}/status`, { status }).then(res => res.data);
export const archiveTask = (id) => axios.post(`${API_BASE}/archive/${id}`).then(res => res.data);
export const unarchiveTask = (id) => axios.post(`${API_BASE}/unarchive/${id}`).then(res => res.data);
export const getArchive = () => axios.get(`${API_BASE}/archive`).then(res => res.data);
export const deleteTask = (id) => axios.delete(`${API_BASE}/tasks/${id}`).then(res => res.data); 