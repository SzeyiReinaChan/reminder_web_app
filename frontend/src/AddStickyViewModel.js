import { useState } from 'react';
import { addTask } from './api';
import { useNavigate } from 'react-router-dom';

export function useAddStickyViewModel() {
  const navigate = useNavigate();
  const [reminder, setReminder] = useState('');
  const [frequency, setFrequency] = useState('');
  const [userType, setUserType] = useState('older adult');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!reminder.trim() || !frequency.trim()) {
      setError('All fields are required');
      return;
    }
    setSubmitting(true);
    try {
      await addTask(`${reminder} (${frequency})`, userType);
      navigate('/');
    } catch (err) {
      setError('Failed to add reminder');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reminder,
    setReminder,
    frequency,
    setFrequency,
    userType,
    setUserType,
    error,
    submitting,
    handleSubmit,
  };
} 