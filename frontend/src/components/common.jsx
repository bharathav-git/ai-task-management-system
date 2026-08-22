import React from "react";

export function BackButton({ onBack, text }) {
  return (
    <button className="back-button" onClick={onBack}>
      ← {text}
    </button>
  );
}