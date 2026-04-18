import React from 'react';

interface SegmentedControlProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
}

export const SegmentedControl = ({ options, value, onChange }: SegmentedControlProps) => {
    return (
        <div className="segmented-control">
            {options.map(opt => (
                <button
                    key={opt.value}
                    className={`segmented-button ${value === opt.value ? 'active' : ''}`}
                    onClick={() => onChange(opt.value)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};
