import React, { useMemo, useState, useEffect, useRef } from 'react';
import HeroCarousel from './HeroCarousel';
import CalendarGrid from './CalendarGrid';
import ImportantDaysPanel from './ImportantDaysPanel';
import MonthNotesPanel from './MonthNotesPanel';
import DayDetailPanel from './DayDetailPanel';
import ReminderModal from './ReminderModal';
import {
  MONTH_NAMES,
  MONTH_SHORT_NAMES,
  monthQuoteSlides,
  monthImportantDays
} from '../data/calendarData';
import './CalendarPage.css';

const STORAGE_KEYS = {
  reminders: 'tuf_calendar_reminders_by_month',
  bulletNotes: 'tuf_calendar_bullet_notes_by_month',
  theme: 'tuf_april_theme'
};

function CalendarPage() {
  const today = new Date();
  const year = today.getFullYear();
  const leftStackRef = useRef(null);
  const rightStackRef = useRef(null);

  const [activeMonthIndex, setActiveMonthIndex] = useState(today.getMonth());
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [remindersByMonth, setRemindersByMonth] = useState({});
  const [bulletNotesByMonth, setBulletNotesByMonth] = useState({});
  const [leftTopRatio, setLeftTopRatio] = useState(70);
  const [rightTopRatio, setRightTopRatio] = useState(50);
  const [dragState, setDragState] = useState(null);
  const [draftNote, setDraftNote] = useState('');
  const [modalDay, setModalDay] = useState(null);
  const [themeMode, setThemeMode] = useState('default');

  const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));

  const monthLabel = MONTH_NAMES[activeMonthIndex];
  const monthShortLabel = MONTH_SHORT_NAMES[activeMonthIndex];
  const daysInMonth = useMemo(() => new Date(year, activeMonthIndex + 1, 0).getDate(), [year, activeMonthIndex]);
  const monthSlides = monthQuoteSlides[activeMonthIndex] || [];
  const activeImportantDays = monthImportantDays[activeMonthIndex] || [];
  const reminders = remindersByMonth[activeMonthIndex] || {};
  const bulletNotes = bulletNotesByMonth[activeMonthIndex] || [];

  const importantDayByDate = useMemo(() => {
    return activeImportantDays.reduce((acc, entry) => {
      acc[entry.day] = entry;
      return acc;
    }, {});
  }, [activeImportantDays]);

  useEffect(() => {
    const savedReminders = localStorage.getItem(STORAGE_KEYS.reminders);
    const savedBulletNotes = localStorage.getItem(STORAGE_KEYS.bulletNotes);

    if (savedReminders) {
      const parsed = JSON.parse(savedReminders);
      const firstValue = parsed ? Object.values(parsed)[0] : null;

      // Backward compatibility for old April-only reminder storage shape.
      if (firstValue && typeof firstValue === 'object' && ('title' in firstValue || 'note' in firstValue || 'time' in firstValue)) {
        setRemindersByMonth({
          3: parsed
        });
      } else {
        setRemindersByMonth(parsed || {});
      }
    }

    if (savedBulletNotes) {
      const parsed = JSON.parse(savedBulletNotes);

      // Backward compatibility for old April-only notes array.
      if (Array.isArray(parsed)) {
        setBulletNotesByMonth({
          3: parsed
        });
      } else {
        setBulletNotesByMonth(parsed || {});
      }
    }

    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme === 'default' || savedTheme === 'alt') {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(remindersByMonth));
  }, [remindersByMonth]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bulletNotes, JSON.stringify(bulletNotesByMonth));
  }, [bulletNotesByMonth]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedDay, daysInMonth]);

  const firstWeekdayOffset = useMemo(() => {
    const jsDay = new Date(year, activeMonthIndex, 1).getDay();
    return (jsDay + 6) % 7;
  }, [year, activeMonthIndex]);

  const selectedOccasion = selectedDay ? importantDayByDate[selectedDay] : null;

  const isDayPassed = (day) => {
    const targetDate = new Date(year, activeMonthIndex, day, 23, 59, 59);
    return targetDate < new Date();
  };

  const changeMonth = (direction) => {
    const nextMonth = clampValue(activeMonthIndex + direction, 0, 11);

    if (nextMonth === activeMonthIndex) {
      return;
    }

    const nextMonthDays = new Date(year, nextMonth + 1, 0).getDate();
    setActiveMonthIndex(nextMonth);
    setSelectedDay((prev) => Math.min(prev, nextMonthDays));
    setRangeStart(null);
    setRangeEnd(null);
    setActiveSlide(0);
    setModalDay(null);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
      return;
    }

    if (day < rangeStart) {
      setRangeEnd(rangeStart);
      setRangeStart(day);
      return;
    }

    setRangeEnd(day);
  };

  const handleSaveReminder = (day, payload) => {
    setRemindersByMonth((prev) => ({
      ...prev,
      [activeMonthIndex]: {
        ...(prev[activeMonthIndex] || {}),
        [day]: payload
      }
    }));
    setModalDay(null);
  };

  const handleDeleteReminder = (day) => {
    setRemindersByMonth((prev) => {
      const monthReminders = { ...(prev[activeMonthIndex] || {}) };
      delete monthReminders[day];

      return {
        ...prev,
        [activeMonthIndex]: monthReminders
      };
    });
    setModalDay(null);
  };

  const handleAddBulletNote = () => {
    const cleanNote = draftNote.trim();
    if (!cleanNote) {
      return;
    }

    setBulletNotesByMonth((prev) => {
      const currentMonthNotes = prev[activeMonthIndex] || [];
      return {
        ...prev,
        [activeMonthIndex]: [cleanNote, ...currentMonthNotes]
      };
    });
    setDraftNote('');
  };

  const handleDeleteBulletNote = (indexToDelete) => {
    setBulletNotesByMonth((prev) => {
      const currentMonthNotes = prev[activeMonthIndex] || [];
      return {
        ...prev,
        [activeMonthIndex]: currentMonthNotes.filter((_, index) => index !== indexToDelete)
      };
    });
  };

  const handleThemeToggle = () => {
    setThemeMode((prev) => (prev === 'default' ? 'alt' : 'default'));
  };

  const startDividerDrag = (side, event) => {
    event.preventDefault();
    const pointY = event.touches ? event.touches[0].clientY : event.clientY;

    if (side === 'left') {
      setDragState({ side, startY: pointY, startRatio: leftTopRatio, min: 45, max: 68 });
      return;
    }

    setDragState({ side, startY: pointY, startRatio: rightTopRatio, min: 30, max: 70 });
  };

  useEffect(() => {
    if (!dragState) {
      return undefined;
    }

    const handleMove = (event) => {
      const pointY = event.touches ? event.touches[0].clientY : event.clientY;
      const stackRef = dragState.side === 'left' ? leftStackRef : rightStackRef;
      const bounds = stackRef.current?.getBoundingClientRect();

      if (!bounds || bounds.height <= 0) {
        return;
      }

      if (event.touches) {
        event.preventDefault();
      }

      const deltaY = pointY - dragState.startY;
      const nextRatio = clampValue(
        dragState.startRatio + (deltaY / bounds.height) * 100,
        dragState.min,
        dragState.max
      );

      if (dragState.side === 'left') {
        setLeftTopRatio(nextRatio);
      } else {
        setRightTopRatio(nextRatio);
      }
    };

    const stopDrag = () => {
      setDragState(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', stopDrag);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', stopDrag);
    };
  }, [dragState]);

  return (
    <main className={`calendar-page py-4 py-lg-5 ${themeMode === 'alt' ? 'theme-alt' : ''}`}>
      <div className="calendar-layout-container">
        <section className="calendar-sheet mx-auto">
          <div className="calendar-sheet-ring" aria-hidden="true" />
          <div className="calendar-sheet-body p-2">
            <div className="calendar-theme-toggle-row">
              <button
                type="button"
                className="calendar-theme-toggle-btn"
                onClick={handleThemeToggle}
                aria-label="Toggle calendar color theme"
              >
                {themeMode === 'default' ? 'Switch Theme' : 'Default Theme'}
              </button>
            </div>

            <div className="calendar-photo-row">
              <HeroCarousel
                monthTitle={monthLabel.toUpperCase()}
                year={year}
                slides={monthSlides}
                activeSlide={activeSlide}
                onSlideChange={setActiveSlide}
                selectedOccasion={selectedOccasion}
              />
            </div>

            <div className="calendar-divider my-2" aria-hidden="true" />

            <div className="calendar-main-row">
              <div className="calendar-main-left">
                <div
                  ref={leftStackRef}
                  className="calendar-left-stack"
                  style={{
                    '--top-ratio': `${leftTopRatio}%`,
                    '--panel-top-ratio-num': leftTopRatio / 100,
                    '--panel-bottom-ratio-num': (100 - leftTopRatio) / 100
                  }}
                >
                  <div className="calendar-left-top">
                    <CalendarGrid
                      year={year}
                      monthLabel={monthLabel}
                      daysInMonth={daysInMonth}
                      firstWeekdayOffset={firstWeekdayOffset}
                      selectedDay={selectedDay}
                      rangeStart={rangeStart}
                      rangeEnd={rangeEnd}
                      importantDays={importantDayByDate}
                      reminders={reminders}
                      isDayPassed={isDayPassed}
                      onDayClick={handleDayClick}
                      onBellClick={setModalDay}
                      onPrevMonth={() => changeMonth(-1)}
                      onNextMonth={() => changeMonth(1)}
                      canGoPrevMonth={activeMonthIndex > 0}
                      canGoNextMonth={activeMonthIndex < 11}
                    />
                  </div>

                  <div
                    className="panel-splitter"
                    role="separator"
                    aria-orientation="horizontal"
                    aria-label="Resize wall calendar and important days"
                    onMouseDown={(event) => startDividerDrag('left', event)}
                    onTouchStart={(event) => startDividerDrag('left', event)}
                  >
                    <span className="panel-splitter-grip" aria-hidden="true" />
                  </div>

                  <div className="calendar-left-bottom">
                    <ImportantDaysPanel
                      title={`Important Days of ${monthLabel}`}
                      importantDays={activeImportantDays}
                      selectedDay={selectedDay}
                      onDayClick={handleDayClick}
                      monthShortLabel={monthShortLabel}
                    />
                  </div>
                </div>
              </div>

              <div className="calendar-main-right">
                <div
                  ref={rightStackRef}
                  className="calendar-right-stack"
                  style={{
                    '--top-ratio': `${rightTopRatio}%`,
                    '--panel-top-ratio-num': rightTopRatio / 100,
                    '--panel-bottom-ratio-num': (100 - rightTopRatio) / 100
                  }}
                >
                  <div className="calendar-right-top">
                    <MonthNotesPanel
                      title={`${monthLabel} Notes`}
                      notes={bulletNotes}
                      draftNote={draftNote}
                      onDraftChange={setDraftNote}
                      onAddNote={handleAddBulletNote}
                      onDeleteNote={handleDeleteBulletNote}
                    />
                  </div>

                  <div
                    className="panel-splitter"
                    role="separator"
                    aria-orientation="horizontal"
                    aria-label="Resize notes and reminders"
                    onMouseDown={(event) => startDividerDrag('right', event)}
                    onTouchStart={(event) => startDividerDrag('right', event)}
                  >
                    <span className="panel-splitter-grip" aria-hidden="true" />
                  </div>

                  <div className="calendar-right-bottom">
                    <DayDetailPanel
                      reminders={reminders}
                      monthLabel={monthLabel}
                      selectedDay={selectedDay}
                      rangeStart={rangeStart}
                      rangeEnd={rangeEnd}
                      onDayClick={handleDayClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ReminderModal
        day={modalDay}
        show={modalDay !== null}
        initialReminder={modalDay !== null ? reminders[modalDay] : null}
        onClose={() => setModalDay(null)}
        onSave={handleSaveReminder}
        onDelete={handleDeleteReminder}
        monthLabel={monthLabel}
      />
    </main>
  );
}

export default CalendarPage;
