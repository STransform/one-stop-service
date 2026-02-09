'use client';
import React, { useEffect, useRef } from 'react';
import { FormBuilder } from 'formiojs';

interface FormBuilderComponentProps {
  options?: any;
  onChange?: (schema: any) => void;
}

const FormBuilderComponent: React.FC<FormBuilderComponentProps> = ({ options, onChange }) => {
  const formBuilderRef = useRef<HTMLDivElement>(null);
  const builderInstance = useRef<any>(null);

  useEffect(() => {
    if (formBuilderRef.current && !builderInstance.current) {
      // Simplified builder options
      const builderOptions = {
        noDefaultSubmitButton: false,
        ...options
      };

      builderInstance.current = new FormBuilder(
        formBuilderRef.current,
        { display: 'form' },
        builderOptions
      );

      builderInstance.current.ready.then(() => {
        builderInstance.current.on('change', (schema: any) => {
          if (onChange) onChange(schema);
        });
      });
    }

    return () => {
      if (builderInstance.current) {
        builderInstance.current.destroy();
        builderInstance.current = null;
      }
    };
  }, [options, onChange]);

  return <div ref={formBuilderRef} />;
};

export default FormBuilderComponent;
