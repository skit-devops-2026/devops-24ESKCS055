import React, { useState } from "react";
import { CATEGORIES } from "../data/mockPosts";

const AddPostModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;
    onSubmit({ title, category, description });
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <form className="modal-content card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
          <h3>Start a Debate</h3>

          <label>Title</label>
          <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's the issue?" />

          <label>Category</label>
          <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <label>Description</label>
          <textarea className="input-field" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain your point of view..." />

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Post</button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(43, 43, 43, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .modal-content {
          width: 460px;
          max-width: 90%;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .modal-content h3 { margin-bottom: 10px; }
        .modal-content label { font-size: 13px; font-weight: 600; margin-top: 10px; color: var(--color-muted); }
        .modal-content textarea { resize: vertical; font-family: 'Inter', sans-serif; }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 18px;
        }
      `}</style>
    </>
  );
};

export default AddPostModal;