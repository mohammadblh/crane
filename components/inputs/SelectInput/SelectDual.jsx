import React, { useState, useEffect } from 'react';
import {
  View,
} from 'react-native';
import SelectBox from './Select1';
const SelectDual = ({
  label = "انتخاب:",
  placeholder = "انتخاب کنید",
  options = [],
  options2 = {},
  selectedValue,
  onSelect,
  itemKey = "",
  maxVisibleItems = 3,
  disabled = false,
}) => {
  const [category, setCategory] = useState(selectedValue?.category || null);
  const [subCategory, setSubCategory] = useState(selectedValue?.subCategory || null);

  useEffect(() => {
    if (selectedValue?.category) setCategory(selectedValue.category);
    if (selectedValue?.subCategory) setSubCategory(selectedValue.subCategory);
  }, [selectedValue]);

  const subOptions = category
    ? Object.values(options2?.[category] || {})
    : [];

  const handleCategoryChange = (val) => {
    setCategory(val);
    setSubCategory(null);

    onSelect?.({
      category: val,
      subCategory: null,
    });
  };

  const handleSubCategoryChange = (val) => {
    setSubCategory(val);

    onSelect?.({
      category,
      subCategory: val,
    });
  };

  return (
    <View>
      <SelectBox
        label={label}
        placeholder={placeholder}
        options={options}
        selectedValue={category}
        onSelect={handleCategoryChange}
        itemKey={itemKey}
        maxVisibleItems={maxVisibleItems}
        disabled={disabled}
      />

      <SelectBox
        label={"زیر مجموعه"}
        placeholder="انتخاب زیر مجموعه"
        options={subOptions}
        selectedValue={subCategory}
        onSelect={handleSubCategoryChange}
        itemKey="زیر مجموعه"
        maxVisibleItems={maxVisibleItems}
        disabled={!category || disabled}
      />
    </View>
  );
};

export default SelectDual;
