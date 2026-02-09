'use client';
import React, { useEffect, useRef } from 'react';
import { Formio } from 'formiojs';

interface FormRendererComponentProps {
    form: any;
    submission?: any;
    options?: any;
    onSubmit?: (submission: any) => void;
}

const FormRendererComponent: React.FC<FormRendererComponentProps> = ({ form, submission, options, onSubmit }) => {
    const formRendererRef = useRef<HTMLDivElement>(null);
    const formInstance = useRef<any>(null);

    useEffect(() => {
        if (formRendererRef.current && form) {
            Formio.createForm(formRendererRef.current, form, options).then((instance: any) => {
                formInstance.current = instance;

                if (submission) {
                    instance.submission = submission;
                }

                instance.on('submit', (submissionData: any) => {
                    if (onSubmit) onSubmit(submissionData);
                });
            });
        }

        return () => {
            if (formInstance.current) {
                formInstance.current.destroy();
                formInstance.current = null;
            }
        };
    }, [form, submission, options, onSubmit]);

    return <div ref={formRendererRef} />;
};

export default FormRendererComponent;
