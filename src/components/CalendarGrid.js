import React from 'react';
import './CalendarGrid.css';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
function CalendarGrid({
  year,
  monthLabel,
  daysInMonth,
  firstWeekdayOffset,
  selectedDay,
  rangeStart,
  rangeEnd,
  importantDays,
  reminders,
  isDayPassed,
  onDayClick,
  onBellClick,
  onPrevMonth,
  onNextMonth,
  canGoPrevMonth,
  canGoNextMonth
}) {
  const dayCells = [];
  for (let index = 0; index < firstWeekdayOffset; index += 1) {
    dayCells.push(<div className="calendar-day-empty" key={`empty-${index}`} />);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const hasReminder = Boolean(reminders[day]);
    const isSelected = day === selectedDay;
    const inRange = rangeStart && rangeEnd && day > rangeStart && day < rangeEnd;
    const isStart = day === rangeStart;
    const isEnd = day === rangeEnd;
    const reminderActive = hasReminder && !isDayPassed(day);
    const hasImportantDay = Boolean(importantDays[day]);
    const importantDayName = hasImportantDay ? importantDays[day].title : '';

    dayCells.push(
      <div
        key={day}
        role="button"
        tabIndex={0}
        className={[
          'calendar-day-cell',
          isSelected ? 'calendar-selected' : '',
          inRange ? 'calendar-in-range' : '',
          isStart ? 'calendar-range-start' : '',
          isEnd ? 'calendar-range-end' : '',
          reminderActive ? 'calendar-reminder-active' : '',
          hasImportantDay ? 'calendar-important' : ''
        ].join(' ')}
        onClick={() => onDayClick(day)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onDayClick(day);
          }
        }}
      >
        <span className="calendar-day-number">{day}</span>
        {hasImportantDay && (
          <span className="calendar-day-event" title={importantDayName}>
            {importantDayName}
          </span>
        )}
        <button
          type="button"
          className="calendar-bell-btn"
          onClick={(event) => {
            event.stopPropagation();
            onBellClick(day);
          }}
          aria-label={`Set reminder for ${monthLabel} ${day}`}
        >
          &#128276;
        </button>
      </div>
    );
  }

  // Keep a fixed 6-week matrix so the grid always occupies full available height.
  const totalSlots = 42;
  const trailingEmptyCount = Math.max(0, totalSlots - dayCells.length);
  for (let index = 0; index < trailingEmptyCount; index += 1) {
    dayCells.push(
      <div
        className="calendar-day-empty calendar-day-empty-trailing"
        key={`trailing-empty-${index}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <section className="calendar-grid-card h-100">
      <div className="calendar-grid-head">
        <div className="calendar-grid-head-main calendar-grid-head-main-nav">
          <p className="calendar-grid-label">Wall Calendar</p>
          <div className="calendar-month-nav" role="group" aria-label="Month navigation">
            <button
              type="button"
              className="calendar-month-btn"
              onClick={onPrevMonth}
              disabled={!canGoPrevMonth}
              aria-label="Previous month"
            >
              ◀
            </button>
            <h3 className="calendar-grid-title">{monthLabel}</h3>
            <button
              type="button"
              className="calendar-month-btn"
              onClick={onNextMonth}
              disabled={!canGoNextMonth}
              aria-label="Next month"
            >
              ▶
            </button>
          </div>
        </div>
        <p className="calendar-grid-year">{year}</p>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day} className="calendar-weekday">
            {day}
          </span>
        ))}
      </div>

      <div className="calendar-days-wrapper">{dayCells}</div>
    </section>
  );
}

export default CalendarGrid;