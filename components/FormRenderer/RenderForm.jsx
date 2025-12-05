// RenderForm.js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import InputRender from './InputRender';
import SelectRender from './SelectRender';
import CheckboxRender from './CheckboxRender';
import FileUpload from '../inputs/File/FileUpload';
import DatePickerComponent from '../inputs/Date/DatePickerComponent';

export default function RenderForm({ data, onChange }) {
  const [formData, setFormData] = useState({});

  // Initialize form data with default values
  useEffect(() => {
    const initialData = {};
    data.forEach((field) => {
      initialData[field.sectionId] = field.defaultValue || null;
    });
    setFormData(initialData);
  }, []);

  // Call onChange whenever formData changes
  useEffect(() => {
    if (Object.keys(formData).length > 0 && onChange) {
      onChange(formData);
    }
  }, [formData]);

  const handleFieldChange = (sectionId, value) => {
    setFormData((prev) => ({
      ...prev,
      [sectionId]: value,
    }));
  };

  const renderField = (field) => {
    switch (field.type) {
      case 1:
        return (
          <InputRender
            field={field}
            value={formData[field.sectionId]}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          />
        );

      case 4:
        return (
          <SelectRender
            field={field}
            value={formData[field.sectionId]}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          />
        );

      case 5:
        return (
          <CheckboxRender
            field={field}
            value={formData[field.sectionId]}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          />
        );

      case 7: // Date Picker
        return (
          <DatePickerComponent
            field={field}
            value={field.defaultValue}
            onChange={onChange}
          />
        );

      case 8:
        return <FileUpload
          field={field}
          value={formData[field.sectionId]}
          onChange={(value) => handleFieldChange(field.sectionId, value)}
        />

      default:
        return <Text>نوع پشتیبانی نشده: {field.type}</Text>;
    }
  };

  return (
    <View style={{ padding: 10 }}>
      {data.map((field) => (
        <View key={field.sectionId} style={{ marginBottom: 10 }}>
          {renderField(field)}
        </View>
      ))}
    </View>
  );
}
