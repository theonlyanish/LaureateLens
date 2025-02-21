import styles from '../styles/Controls.module.css';

// Type for sorting fields
type SortField = 'name' | 'email';

// Interface for sort configuration
interface SortConfig {
  field: SortField;
  direction: 'asc' | 'desc';
}

// Interface for sort controls props
interface SortControlsProps {
  onSort: (field: SortField) => void;
  currentSort: SortConfig;
}

// Sort controls component
const SortControls = ({ onSort, currentSort }: SortControlsProps) => {
  // Helper function to render sort direction indicator for asc or desc
  const getSortIndicator = (field: SortField) => {
    if (currentSort.field !== field) return null;
    return currentSort.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className={styles['sort-controls']}>
      <button 
        onClick={() => onSort('name')} 
        className={`${styles['sort-button']} ${currentSort.field === 'name' ? styles.active : ''}`}
      >
        Sort by Name{getSortIndicator('name')}
      </button>
      <button 
        onClick={() => onSort('email')} 
        className={`${styles['sort-button']} ${currentSort.field === 'email' ? styles.active : ''}`}
      >
        Sort by Email{getSortIndicator('email')}
      </button>
    </div>
  );
};

export default SortControls; 