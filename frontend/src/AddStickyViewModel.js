import { useState } from 'react';
import { addTask } from './api';

export function useAddStickyViewModel(userType, onSuccess) {
  const [reminder, setReminder] = useState('');
  const [frequency, setFrequency] = useState('');
  const [selectedUserType, setSelectedUserType] = useState(userType);
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
      await addTask(`${reminder} (${frequency})`, selectedUserType, userType);
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
    userType: selectedUserType,
    setUserType: setSelectedUserType,
    error,
    submitting,
    handleSubmit,
  };
} 