import React, { useState } from 'react';

const StarRating = ({ rating = 0, onRatingChange, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (star) => {
    if (!readOnly) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const handleClick = (star) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(star);
    }
  };

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star ${
            star <= (hoverRating || rating) ? 'filled' : ''
          } ${readOnly ? '' : 'interactive'}`}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(star)}
          style={{ 
            cursor: readOnly ? 'default' : 'pointer',
            pointerEvents: readOnly ? 'none' : 'auto'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;