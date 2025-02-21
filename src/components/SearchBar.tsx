import styles from '../styles/Controls.module.css';

// Search bar component for filtering users by name
interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className={styles['search-bar']}>
      <input
        type="text"
        placeholder="Search users by name, email, or company..."
        onChange={(e) => onSearch(e.target.value)}
        className={styles['search-input']}
      />
    </div>
  );
};

export default SearchBar; 