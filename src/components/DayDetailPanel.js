import React from 'react';
import './DayDetailPanel.css';

function DayDetailPanel({
  reminders,
  monthLabel,
  selectedDay,
  onDayClick,
  rangeStart,
  rangeEnd
}) {
  const hasCompletedRange = rangeStart !== null && rangeEnd !== null;
  const selectedRangeDayCount = hasCompletedRange ? rangeEnd - rangeStart + 1 : 0;

  const reminderItems = Object.entries(reminders)
    .map(([day, reminder]) => ({
      day: Number(day),
      title: reminder?.title || reminder?.note || 'Reminder set',
      note: reminder?.note || '',
      time: reminder?.time || ''
    }))
    .filter((item) => {
      if (!hasCompletedRange) {
        return true;
      }

      return item.day >= rangeStart && item.day <= rangeEnd;
    })
    .sort((a, b) => a.day - b.day);

  return (
    <section className="day-detail-card card h-100">
      <div className="card-header day-detail-header">
        <p className="day-detail-label">Reminders</p>
        <h4 className="day-detail-title">
          {hasCompletedRange
            ? `Date + Purpose (${rangeStart}-${rangeEnd}, ${selectedRangeDayCount} days)`
            : 'Date + Purpose'}
        </h4>
      </div>

      <ul className="day-reminder-list list-group list-group-flush">
        {reminderItems.length === 0 && (
          <li className="day-reminder-empty list-group-item">
            {hasCompletedRange ? 'No reminders in selected range.' : 'No reminders set yet.'}
          </li>
        )}

        {reminderItems.map((item) => (
          <li
            key={item.day}
            className={`day-reminder-item list-group-item ${selectedDay === item.day ? 'day-reminder-active' : ''}`}
          >
            <button type="button" className="day-reminder-btn" onClick={() => onDayClick(item.day)}>
              <span className="day-reminder-date">{monthLabel} {item.day}</span>
              <span className="day-reminder-purpose">{item.title}</span>
              {item.time && <span className="day-reminder-time">{item.time}</span>}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default DayDetailPanel;