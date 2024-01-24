import { usePdfEditorContext } from "@/app/contexts/pdfEditorContext";
import { ClientTemplateChildrenProps,CreateTemplateInputProps } from "@/app/interfaces/RegisterClientInterfaces";
import { useEffect, useState } from "react";

export default function BackgroundImageModal(){

    const { backgroundImage,setBackgroundImage } = usePdfEditorContext();

    return (
        <form className="mt-3 w-2/4 bg-neutral-50 drop-shadow rounded-md p-2 flex flex-col"
            onSubmit={(e: any) => {
                e.preventDefault();
                setBackgroundImage({...backgroundImage,url:null});
                sessionStorage.removeItem("background_image_url");
            }}>
            <div className="mb-3 flex gap-2 items-center">
                <label htmlFor="border" className="inline-block whitespace-nowrap">Canto: </label>
                <select required onChange={(e) => setBackgroundImage({...backgroundImage,section:e.target.value})} defaultValue={backgroundImage.section}
                    className="w-full" name="border" id="border">
                    <option value="center">Centralizado</option>
                    <option value="top-right">Superior direito</option>
                    <option value="top-left">Superior esquerdo</option>
                    <option value="bottom-right">Inferior direito</option>
                    <option value="bottom-left">Inferior esquerdo</option>
                </select>
            </div>
            <div className="mb-3 flex justify-center items-center">
                <img className="max-w-80" src={backgroundImage.url ? backgroundImage.url : "https://placehold.co/300x300?text=Imagem+de+fundo"} />
            </div>
            <button type="submit" className="bg-neutral-100 drop-shadow rounded-md p-2 text-center">Remover</button>
        </form>     
    )
}