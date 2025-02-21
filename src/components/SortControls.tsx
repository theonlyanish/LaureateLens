
// Type for sorting fields
type SortField = 'name' | 'email';

// Interface for sort controls props
interface SortControlsProps {
  onSort: (field: SortField) => void;
}

// Sort controls component
const SortControls = ({ onSort }: SortControlsProps) => {
  return (
    <div className="sort-controls">
      <button onClick={() => onSort('name')} className="sort-button">
        Sort by Name
      </button>
      <button onClick={() => onSort('email')} className="sort-button">
        Sort by Email
      </button>
    </div>
  );
};

export default SortControls; 