// RenderForm.js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import InputRender from './InputRender';
import SelectRender from './SelectRender';
import CheckboxRender from './CheckboxRender';
import FileUpload from '../inputs/File/FileUpload';
import DatePickerComponent from '../inputs/Date/DatePickerComponent';
import DatePickerComponent2 from '../inputs/Date/DatePicker2';
import MapView from '../inputs/Map/MapView';
import SectionTitle from '../inputs/Text/SectionTitle';

export default function RenderForm({ data, onChange, index = 1 }) {
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
    if (field.sectionId) {
      field.sectionId = `${field.sectionId}`;
    }

    // اگه با f_ شروع نمیشه (یعنی فقط عدد خالصه)
    if (!field.sectionId.startsWith('f_')) {
      field.sectionId = `f_${field.sectionId}_${index}`;
    }
    // اگه با f_ شروع میشه (فرمت f_something_number داره)
    else {
      // استخراج بخش عدد اصلی (بین f_ و آخرین عدد)
      const matches = field.sectionId.match(/^f_(\d+)_\d+$/);
      if (matches) {
        const baseNumber = matches[1]; // عدد اصلی رو بگیر
        field.sectionId = `f_${baseNumber}_${index}`;
      } else {
        // اگه فرمت غیرمنتظره داشت، بازسازی کن
        field.sectionId = `f_${field.sectionId}_${index}`;
      }
    }
    // if (field.sectionId !== `f_${field.sectionId}_${index}`) field.sectionId = `f_${field.sectionId}_${index}`;
    // if (!field.sectionId.includes(`f_${field.sectionId}_${index}`)) field.sectionId = `f_${field.sectionId}_${index}`;

    switch (field.type) {
      case 0:
        field.style = 2;
        return <InputRender
          field={field}
          value={formData[field.sectionId]}
          onChange={(value) => handleFieldChange(field.sectionId, value)}
        />

      // case 0: // text
      //   return <SectionTitle
      //     title={field.title}
      //     sx={field.sx}
      //   />

      case 1: // input textarea
        field.style = 3;
        return (
          <InputRender
            field={field}
            value={formData[field.sectionId]}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          />
        );

      case 3:
        field.style = 4; // Force number input style for type 3
        return (
          <InputRender
            field={field}
            value={formData[field.sectionId]}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          />
        );

      case 4:
        console.log(field);
        // field.style = 5;
        return (
          <SelectRender
            field={field}
            value={formData[field.sectionId]}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          />
        );

      case 5:
        if (!field.options) field.style = 3;
        return (
          <CheckboxRender
            field={field}
            value={formData[field.sectionId]}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          />
        );

      case 51:
        return (
          <CheckboxRender
            field={field}
            value={formData[field.sectionId]}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          />
        );

      case 6: // Date Picker
        return (
          <DatePickerComponent2
            // <DatePickerComponent
            field={field}
            value={field.defaultValue}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          // onChange={onChange}
          />
        );

      case 7:
        return <FileUpload
          field={field}
          value={formData[field.sectionId]}
          onChange={(value) => handleFieldChange(field.sectionId, value)}
        />

      case 8:
        return <FileUpload
          field={field}
          value={formData[field.sectionId]}
          onChange={(value) => handleFieldChange(field.sectionId, value)}
        />

      case 10: // select dual
        field.style = 10;
        return (
          <SelectRender
            field={field}
            value={formData[field.sectionId]}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          />
        );

      case 28: // select with add form
        field.style = 3;
        if (!field.options) return null;
        return (
          <SelectRender
            field={field}
            value={formData[field.sectionId]}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          />
        );

      case 36: // Map
        // case 10: // Map
        return (
          <MapView
            field={field}
            value={formData[field.sectionId]}
            onChange={(value) => handleFieldChange(field.sectionId, value)}
          />
        );

      default:
        return <Text>نوع پشتیبانی نشده: {field.type}</Text>;
    }
  };

  return (
    <View style={{ padding: 10 }}>
      {data.map((field, i) => (
        <View key={i} style={{ marginBottom: 10 }}>
          {renderField(field)}
        </View>
      ))}
    </View>
  );
}
