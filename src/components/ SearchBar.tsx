// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import data from '../patientAndGuidelineData.json'; // Load the unified JSON

interface SearchBarProps {
  onSearch: (id: string) => void;
  tab: 'patients' | 'guidelines';
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, tab }) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSelection = (event: any, newValue: string | null) => {
    if (newValue) {
      onSearch(newValue);
    }
  };

  const options = tab === 'patients' ? Object.keys(data.patient) : Object.keys(data.guideline);

  return (
    <Autocomplete
      freeSolo
      options={options}
      value={searchValue}
      onChange={handleSearchSelection}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          variant="outlined"
          onChange={handleInputChange}
        />
      )}
    />
  );
};

export default SearchBar;
