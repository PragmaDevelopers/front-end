import React, { createContext, useContext, useState, ReactNode } from 'react';
import { userValueDT } from '../types/KanbanTypes';
import { UserContextProps } from '../interfaces/KanbanInterfaces';
import { EditorLinesProps, PdfEditorContextProps, backgroundImageProps } from '../interfaces/PdfEditorInterfaces';
import { EditorLine, pdfEditorTemplate } from '../types/PdfEditorTypes';

const PdfEditorContext = createContext<PdfEditorContextProps | undefined>(undefined);

interface PdfEditorContextProviderProps {
  children: ReactNode;
}

export const PdfEditorContextProvider: React.FC<PdfEditorContextProviderProps> = ({ children }) => {
  const [editorLines, setEditorLines] = useState<EditorLinesProps>({lines:[],selectedLineIndex:0,selectedLetterIndex:0,selectedWordIndex:0});
  const [backupPdfEditorTemplate,setBackupPdfEditorTemplate] = useState<EditorLine[]>([]);
  const [backgroundImage,setBackgroundImage] = useState<backgroundImageProps>({
    section: "center",
    url: null
  });
  return (
    <PdfEditorContext.Provider value={{ editorLines, setEditorLines,backgroundImage,setBackgroundImage,backupPdfEditorTemplate,setBackupPdfEditorTemplate }}>
      {children}
    </PdfEditorContext.Provider>
  );
};

export const usePdfEditorContext = (): PdfEditorContextProps => {
  const context = useContext(PdfEditorContext);
  if (!context) {
    throw new Error('usePdfEditorContext must be used within a PdfEditorContextProvider');
  }
  return context;
};