"use client"

import React, { useEffect, useRef } from 'react';
import pdfGenerator from '../../utils/pdfGenerator';
import { pdf } from "@react-pdf/renderer";

function ViewPdf() {

  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function getPdf() {
      let formattedLineLength = sessionStorage.getItem("pdf_formatted_line_length");
      const data: { content: string; style: { justifyContent: "flex-start" | "center" | "flex-end" } }[] = [];

      for (let i = 0; i < Number(formattedLineLength); i++) {
        const formattedLine = sessionStorage.getItem("pdf_formatted_line_" + i);

        if (formattedLine) {
          let styleLine = sessionStorage.getItem("pdf_style_line_" + i);

          if (styleLine) {
            styleLine = styleLine.replace(`"textAlign":"flex-start"`, `"justifyContent":"flex-start"`);
            styleLine = styleLine.replace(`"textAlign":"center"`, `"justifyContent":"center"`);
            styleLine = styleLine.replace(`"textAlign":"flex-end"`, `"justifyContent":"flex-end"`);
            data.push({ content: formattedLine, style: JSON.parse(styleLine) });
          } else {
            data.push({ content: formattedLine, style: { justifyContent: "flex-start" } });
          }
        }
      }

      const blob = await pdf(pdfGenerator(data,undefined)).toBlob();
      const blobUrl = URL.createObjectURL(blob);
      const iframe = ref.current;

      if (iframe) {
        iframe.src = blobUrl;
      }
    }
    getPdf();
  }, [ref.current]);

  return <iframe width="100%" height="100%" ref={ref}></iframe>
}

export default ViewPdf;