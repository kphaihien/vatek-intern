import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
const SearchBar = ({ setSearchValue }) => {
  const { t } = useTranslation();
  const [finalSearchValue, setFinalSearchValue] = useState('');
  const handleChangeSearch = (e) => {
    setFinalSearchValue(e.target.value);
  };

  return (
    <>
      <div className="flex items-center gap-1 self-end">
        <input
          onChange={handleChangeSearch}
          value={finalSearchValue}
          className="rounded-md border border-gray-200 px-2 py-1"
          placeholder={t('todo.search')}
        />
        <button
          onClick={() => setSearchValue(finalSearchValue)}
          className="h-10 w-10 cursor-pointer rounded-md bg-purple-500 py-1 text-xs font-semibold text-white"
        >
          {t('todo.search')}
        </button>
      </div>
    </>
  );
};

export default SearchBar;
