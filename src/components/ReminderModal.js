import React, { useEffect, useState } from 'react';
import './ReminderModal.css';

function ReminderModal({ day, show, initialReminder, onClose, onSave, onDelete, monthLabel }) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [time, setTime] = useState('');

  const hourOptions = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
  const minuteOptions = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

  useEffect(() => {
    if (!show) {
      return;
    }

    setTitle(initialReminder?.title || '');
    setNote(initialReminder?.note || '');
    setTime(initialReminder?.time || '');
  }, [show, initialReminder]);

  if (!show || day === null) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() && !note.trim() && !time) {
      return;
    }

    onSave(day, {
      title: title.trim(),
      note: note.trim(),
      time,
      updatedAt: Date.now()
    });
  };

  const [hourValue = '', minuteValue = ''] = time ? time.split(':') : ['', ''];

  const updateTime = (nextHour, nextMinute) => {
    if (!nextHour && !nextMinute) {
      setTime('');
      return;
    }

    const safeHour = nextHour || '00';
    const safeMinute = nextMinute || '00';
    setTime(`${safeHour}:${safeMinute}`);
  };

  return (
    <div className="reminder-backdrop" role="presentation" onClick={onClose}>
      <div
        className="reminder-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="reminder-modal-head">
          <div>
            <p className="reminder-label">Reminder</p>
            <h4 id="reminder-modal-title" className="reminder-modal-title">
              {monthLabel} {day}
            </h4>
          </div>
          <button type="button" className="reminder-close-btn" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="reminder-form">
          <div className="reminder-field">
            <label htmlFor="reminder-title" className="reminder-input-label">
              Title
            </label>
            <input
              id="reminder-title"
              className="reminder-input"
              placeholder="Example: Client call"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="reminder-field">
            <label htmlFor="reminder-note" className="reminder-input-label">
              Note
            </label>
            <textarea
              id="reminder-note"
              rows="3"
              className="reminder-input reminder-textarea"
              placeholder="Write quick details"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <div className="reminder-field">
            <label htmlFor="reminder-time" className="reminder-input-label">
              Time (optional)
            </label>
            <div className="reminder-time-row" id="reminder-time">
              <select
                className="reminder-input reminder-time-select"
                value={hourValue}
                onChange={(event) => updateTime(event.target.value, minuteValue)}
                aria-label="Hour"
              >
                <option value="">HH</option>
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>

              <span className="reminder-time-separator" aria-hidden="true">:</span>

              <select
                className="reminder-input reminder-time-select"
                value={minuteValue}
                onChange={(event) => updateTime(hourValue, event.target.value)}
                aria-label="Minute"
              >
                <option value="">MM</option>
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="reminder-time-clear"
                onClick={() => setTime('')}
                aria-label="Clear time"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="reminder-actions">
            {initialReminder && (
              <button type="button" className="reminder-btn reminder-btn-danger" onClick={() => onDelete(day)}>
                Delete
              </button>
            )}
            <button type="submit" className="reminder-btn reminder-btn-primary">
              Save reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReminderModal;
