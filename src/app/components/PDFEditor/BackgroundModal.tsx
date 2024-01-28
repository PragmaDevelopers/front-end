import { usePdfEditorContext } from "@/app/contexts/pdfEditorContext";
import { ClientTemplateChildrenProps,CreateTemplateInputProps } from "@/app/interfaces/RegisterClientInterfaces";
import { useEffect, useState } from "react";

export default function BackgroundImageModal(){

    const { backgroundImage,setBackgroundImage } = usePdfEditorContext();

    const handleDrop = (e:any) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const base64 = reader.result as string;
            setBackgroundImage({...backgroundImage,url:base64});
        };

        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e:any) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const base64 = reader.result as string;
            setBackgroundImage({...backgroundImage,url:base64});
        };

        reader.readAsDataURL(file);
    };

    const handleDragOver = (e:any) => {
        e.preventDefault();
    };

    return (
        <form className="mt-3 w-2/3 bg-neutral-50 drop-shadow rounded-md p-2 flex flex-col"
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
            <div className="mb-3 flex justify-center items-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <div className="max-w-80  cursor-pointer relative">
                    <input type="file" onChange={handleFileInputChange} className="opacity-0 w-full h-full absolute cursor-pointer" />
                    <img src={backgroundImage.url ? backgroundImage.url : "https://placehold.co/300x300?text=Clique+ou+solte+a+imagem+aqui"} />
                </div>
            </div>
            <button type="submit" className="bg-neutral-100 drop-shadow rounded-md p-2 text-center">Remover</button>
        </form>     
    )
}