import React, { useState, useCallback } from 'react';
import styles from './LoadingOverlay.module.css';

const LoadingOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const words = ['LaureateLens', ':', 'Exploring', 'Brilliance', 'Across', 'the', 'Ages'];

  const handleClick = useCallback(() => {
    setIsExiting(true);
    const totalDuration = (words.length - 1) * 100 + 800; // Last animation duration + delays
    setTimeout(() => {
      setIsVisible(false);
    }, totalDuration);
  }, [words.length]);

  if (!isVisible) return null;

  return (
    <div className={styles.overlayContainer} onClick={handleClick}>
      <div className={styles.textContainer}>
        {words.map((word, index) => (
          <div
            key={index}
            className={`${styles.trailsText} ${isExiting ? styles.exiting : ''}`}
            style={{
              animationDelay: isExiting
                ? `${(words.length - 1 - index) * 0.1}s`
                : `${index * 0.1}s`
            }}
          >
            <div>{word}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingOverlay; 