import { EditorLine, pdfEditorTemplate } from "../types/PdfEditorTypes";

export interface EditorLinesProps {
    lines: EditorLine[],
    selectedLineIndex: number,
    selectedWordIndex: number,
    selectedLetterIndex: number
}

export interface backgroundImageProps {
    url: string | null,
    section: string
}

export interface PdfEditorContextProps {
    setEditorLines: (newValue:EditorLinesProps)=>void,
    editorLines: EditorLinesProps,
    setBackgroundImage: (newValue:backgroundImageProps)=>void,
    backgroundImage: backgroundImageProps,
    currentPdfEditorTemplate: pdfEditorTemplate,
    setCurrentPdfEditorTemplate: (newValue:pdfEditorTemplate)=>void
}
