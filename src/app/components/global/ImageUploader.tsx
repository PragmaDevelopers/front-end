"use client";

import React, { ChangeEvent } from 'react';

interface ImageUploaderProps {
    callback: (arg0: string) => void;
}
export default function ImageUploader(props: ImageUploaderProps) {
    const { callback } = props;
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const base64 = reader.result as string;
                callback(base64);
            };

            reader.readAsDataURL(file);
        }
    };

    return (
        <input type="file" onChange={handleFileChange} />
    );
};
