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
	const [currentClientTemplate, setCurrentClientTemplate] = useState<any>({});
  const [backgroundImage,setBackgroundImage] = useState<backgroundImageProps>({
    section: "center",
    url: null,
    margin: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
    },
    backgroundMargin: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    opacity: 1
  });
  // CRIAR A MARGIN DE TEXTO E BACKGROUND
  return (
    <PdfEditorContext.Provider value={{ currentClientTemplate, setCurrentClientTemplate,editorLines, setEditorLines,backgroundImage,setBackgroundImage,backupPdfEditorTemplate,setBackupPdfEditorTemplate }}>
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