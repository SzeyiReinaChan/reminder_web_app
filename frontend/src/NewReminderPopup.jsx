import React from 'react';
import { CAREGIVER_NAME } from './userNames';

export default function NewReminderPopup({ reminder, onAccept, onDecline }) {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            borderRadius: '16px',
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '320px',
                width: '85%',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                border: '1px solid #ddd',
            }}>
                <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#333',
                }}>
                    🎉 New Reminder!
                </div>

                <div style={{
                    fontSize: '14px',
                    marginBottom: '16px',
                    color: '#666',
                    lineHeight: '1.3',
                }}>
                    {CAREGIVER_NAME} has created a new reminder for you:
                </div>

                <div style={{
                    background: '#fff7d1',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    border: '1px solid #ffe066',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                }}>
                    "{reminder}"
                </div>

                <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '16px',
                }}>
                    Would you like to add this to your reminders?
                </div>

                <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                }}>
                    <button
                        onClick={onAccept}
                        style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseOver={(e) => e.target.style.background = '#218838'}
                        onMouseOut={(e) => e.target.style.background = '#28a745'}
                    >
                        Yes, Add It
                    </button>

                    <button
                        onClick={onDecline}
                        style={{
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseOver={(e) => e.target.style.background = '#5a6268'}
                        onMouseOut={(e) => e.target.style.background = '#6c757d'}
                    >
                        No, Thanks
                    </button>
                </div>
            </div>
        </div>
    );
} 