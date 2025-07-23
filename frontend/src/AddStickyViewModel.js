import { useState } from 'react';
import { addTask } from './api';

export function useAddStickyViewModel(userType, onSuccess) {
  const [reminder, setReminder] = useState('');
  const [frequency, setFrequency] = useState('');
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
      if (onSuccess) onSuccess();
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
    error,
    submitting,
    handleSubmit,
  };
} 