"use client"
import React, { useEffect, useRef, useState } from 'react';
import pdfGenerator from '../../utils/pdfGenerator';
import { pdf } from "@react-pdf/renderer";

function viewPdf() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height,setHeight] = useState(700);
  useEffect(() => {
    async function getPdf(){
      const pdfInfoDataSession = sessionStorage.getItem("pdf_info");
      if(pdfInfoDataSession){
        const data = JSON.parse(pdfInfoDataSession).split("\n\n")
        console.log(data)

        const blob = await pdf(pdfGenerator({data})).toBlob();
        const blobUrl = URL.createObjectURL(blob);
        const iframe = ref.current;
        if(iframe){
          iframe.src = blobUrl;
          setHeight(window.innerHeight)
        }
    }

    }
    getPdf();
  }, []);

  return (
    <iframe width="100%" height={height} ref={ref}></iframe>
  );
}

export default viewPdf;
