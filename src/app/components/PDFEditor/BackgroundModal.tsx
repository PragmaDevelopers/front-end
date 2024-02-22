import { usePdfEditorContext } from "@/app/contexts/pdfEditorContext";
import { useEffect, useState } from "react";

export default function BackgroundImageModal(){

    const { backgroundImage,setBackgroundImage } = usePdfEditorContext();

    const [selectBackground,setSelectBackground] = useState<"first"|"second"|string>("first");

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
                <label htmlFor="border" className="inline-block text-center">Posição da imagem de fundo: </label>
                <select required onChange={(e) => setBackgroundImage({...backgroundImage,section:e.target.value})} defaultValue={backgroundImage.section}
                    className="w-full" name="border" id="border">
                    <option value="center">Centralizado (imagem de fundo fica sem margin)</option>
                    <option value="top-right">Superior direito</option>
                    <option value="top-left">Superior esquerdo</option>
                    <option value="bottom-right">Inferior direito</option>
                    <option value="bottom-left">Inferior esquerdo</option>
                </select>
            </div>
            <select className="mb-3" onChange={(e)=>setSelectBackground(e.target.value)} defaultValue={selectBackground}>
                <option value="first">Margin do texto</option>
                {backgroundImage.section != "center" && <option value="second">Margin da imagem de fundo</option>}
            </select>
            { 
                selectBackground == "first" && <div>
                    <div className="mb-3 flex gap-2 items-center text-center">
                        <label htmlFor="border" className="inline-block w-[15%]">Margin esquerda</label>
                        <input className="w-[35%]" required type="number" onChange={(e) => {
                            const value = Number(e.target.value);
                            setBackgroundImage({...backgroundImage,margin:{...backgroundImage.margin,left:value}})
                        }} defaultValue={backgroundImage.margin.left} />
                        <label htmlFor="border" className="inline-block w-[15%]">Margin direita: </label>
                        <input className="w-[35%]" required type="number" onChange={(e) => {
                            const value = Number(e.target.value);
                            setBackgroundImage({...backgroundImage,margin:{...backgroundImage.margin,right:value}})
                        }} defaultValue={backgroundImage.margin.right} />
                    </div>
                    <div className="mb-3 flex gap-2 items-center text-center">
                        <label htmlFor="border" className="inline-block w-[15%]">Margin cima</label>
                        <input className="w-[35%]" required type="number" onChange={(e) => {
                            const value = Number(e.target.value);
                            setBackgroundImage({...backgroundImage,margin:{...backgroundImage.margin,top:value}})
                        }} defaultValue={backgroundImage.margin.top} />
                        <label htmlFor="border" className="inline-block w-[15%]">Margin baixo: </label>
                        <input className="w-[35%]" required type="number" onChange={(e) => {
                            const value = Number(e.target.value);
                            setBackgroundImage({...backgroundImage,margin:{...backgroundImage.margin,bottom:value}})
                        }} defaultValue={backgroundImage.margin.bottom} />
                    </div>
                </div>
            }
            {
                selectBackground == "second" && <div>
                    <div className="mb-3 flex gap-2 items-center text-center">
                        <label htmlFor="border" className="inline-block w-[15%]">Margin esquerda</label>
                        <input className="w-[35%]" required type="number" onChange={(e) => {
                            const value = Number(e.target.value);
                            setBackgroundImage({...backgroundImage,backgroundMargin:{...backgroundImage.backgroundMargin,left:value}})
                        }} defaultValue={backgroundImage.backgroundMargin.left} />
                        <label htmlFor="border" className="inline-block w-[15%]">Margin direita: </label>
                        <input className="w-[35%]" required type="number" onChange={(e) => {
                            const value = Number(e.target.value);
                            setBackgroundImage({...backgroundImage,backgroundMargin:{...backgroundImage.backgroundMargin,right:value}})
                        }} defaultValue={backgroundImage.backgroundMargin.right} />
                    </div>
                    <div className="mb-3 flex gap-2 items-center text-center">
                        <label htmlFor="border" className="inline-block w-[15%]">Margin cima</label>
                        <input className="w-[35%]" required type="number" onChange={(e) => {
                            const value = Number(e.target.value);
                            setBackgroundImage({...backgroundImage,backgroundMargin:{...backgroundImage.backgroundMargin,top:value}})
                        }} defaultValue={backgroundImage.backgroundMargin.top} />
                        <label htmlFor="border" className="inline-block w-[15%]">Margin baixo: </label>
                        <input className="w-[35%]" required type="number" onChange={(e) => {
                            const value = Number(e.target.value);
                            setBackgroundImage({...backgroundImage,backgroundMargin:{...backgroundImage.backgroundMargin,bottom:value}})
                        }} defaultValue={backgroundImage.backgroundMargin.bottom} />
                    </div>
                </div>
            }
            <div>
                <label htmlFor="opacity" className="block">Largura da imagem de fundo: </label>
                <span className="block text-sm opacity-75 mb-1">* Valor 0 para imagem cobrir a página inteira</span>
                <input className="w-full mb-1" defaultValue={backgroundImage.width} type="number" onChange={(e)=>setBackgroundImage({...backgroundImage,width:Number(e.target.value)})} />
            </div>
            <div>
                <label htmlFor="opacity" className="block">Opacidade ({backgroundImage.opacity}):</label>
                <input className="w-full" defaultValue={backgroundImage.opacity * 10} type="range" min="0" max="10" onChange={(e)=>setBackgroundImage({...backgroundImage,opacity:Number(e.target.value) / 10})} />
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