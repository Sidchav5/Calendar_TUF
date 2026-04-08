import React from 'react';
import './ImportantDaysPanel.css';

function ImportantDaysPanel({ title, importantDays, selectedDay, onDayClick, monthShortLabel }) {
  return (
    <section className="important-days-card h-100">
      <h4 className="important-days-title">{title}</h4>
      <ul className="important-days-list mb-0">
        {importantDays.map((item) => (
          <li key={item.day}>
            <button
              type="button"
              className={`important-day-item card h-100 ${selectedDay === item.day ? 'important-day-active' : ''}`}
              onClick={() => onDayClick(item.day)}
            >
              <div className="card-body p-0 important-day-body">
                <span className="important-day-date">{monthShortLabel} {item.day}</span>
                <span className="important-day-name">{item.title}</span>
                <span className="important-day-tag">{item.shortTag}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ImportantDaysPanel;
