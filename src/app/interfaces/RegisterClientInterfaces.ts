import { IInputType } from "../types/RegisterClientFormTypes"

export interface CepDataProps {
    uf: string,
    localidade: string,
    bairro: string,
    logradouro: string
}

export interface ClientTemplateProps {
    id:number,
    name:string,
    template: {
        pessoa_fisica: any[],
        pessoa_juridica: any[]
    }
}

export interface ClientTemplateChildrenProps {
    pessoa_fisica: any[],
    pessoa_juridica: any[]
}

export interface CreateTemplateInputProps {
    functionType: "new section" | "new input" | "existing input",
    type?: IInputType,
    accordionIndex?: number,
    inputIndex?: number,
    setLabel?: string,
    setName?: string,
    newSectionName?: string,
    valueIndex?: number
}

export interface PdfLineStyleProps {
    content:string,
    style:{ 
        textAlign:"left" | "center" | "right"
    }
}