import { SystemID } from "./KanbanTypes"

export interface EditorLine {
    value: string,
    style: string
}

export interface pdfEditorTemplate {
    id: SystemID,
    name: string,
    template: string
}