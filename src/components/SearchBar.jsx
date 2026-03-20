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
      <div className="self-end flex items-center gap-1">
        <input
          onChange={handleChangeSearch}
          value={finalSearchValue}
          className="border-gray-200  border px-2 py-1 rounded-md"
          placeholder={t('todo.search')}
        />
        <button
          onClick={() => setSearchValue(finalSearchValue)}
          className="bg-purple-500 font-semibold h-10 w-10 text-xs text-white  py-1 rounded-md cursor-pointer "
        >
          {t('todo.search')}
        </button>
      </div>
    </>
  );
};

export default SearchBar;
