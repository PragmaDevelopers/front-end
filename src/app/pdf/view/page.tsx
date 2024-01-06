"use client"
import React, { useEffect, useRef, useState } from 'react';
import pdfGenerator from '../../utils/pdfGenerator';
import { pdf } from "@react-pdf/renderer";

function ViewPdf() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height,setHeight] = useState(700);
  useEffect(() => {
    async function getPdf(){
        let formattedLineLength = sessionStorage.getItem("pdf_formatted_line_length");
        const lines:string[] = [];
        for(let i = 0;i < Number(formattedLineLength);i++){
          const formattedLine = sessionStorage.getItem("pdf_formatted_line_"+i);
        //   let obj = 
        // FAZER O VIEW INTERPRETAR O ALINHAMENTO DE TEXTO E A IMAGEM DE FUNDO
        console.log(formattedLine)
          if(formattedLine){
            lines.push(formattedLine);
          }
        }
        
        console.log(lines)

        const blob = await pdf(pdfGenerator({data:lines})).toBlob();
        const blobUrl = URL.createObjectURL(blob);
        const iframe = ref.current;
        if(iframe){
            iframe.src = blobUrl;
            setHeight(document.documentElement.clientHeight)
        }
    }
    getPdf();
  }, []);

  return (
    <iframe width="100%" height={height} ref={ref}></iframe>
  );
}

export default ViewPdf;
