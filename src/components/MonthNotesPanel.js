import React from 'react';
import './MonthNotesPanel.css';

function MonthNotesPanel({
  title,
  notes,
  draftNote,
  onDraftChange,
  onAddNote,
  onDeleteNote
}) {
  return (
    <section className="month-notes-card h-100">
      <h4 className="month-notes-title">{title}</h4>
      <div className="month-notes-input-row">
        <input
          className="form-control month-notes-input"
          value={draftNote}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Add bullet note"
        />
        <button type="button" className="month-notes-add-btn" onClick={onAddNote}>
          Add
        </button>
      </div>

      <ul className="month-notes-list mb-0">
        {notes.length === 0 && <li className="month-notes-empty">No notes added.</li>}

        {notes.map((note, index) => (
          <li key={`${note}-${index}`} className="month-notes-item">
            <span className="month-notes-bullet">•</span>
            <span className="month-notes-text">{note}</span>
            <button
              type="button"
              className="month-notes-delete-btn"
              onClick={() => onDeleteNote(index)}
              aria-label="Delete note"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MonthNotesPanel;
