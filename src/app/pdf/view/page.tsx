"use client"

import React, { useEffect, useRef } from 'react';
import pdfGenerator from '../../utils/pdfGenerator';
import { pdf } from "@react-pdf/renderer";
import { usePdfEditorContext } from '@/app/contexts/pdfEditorContext';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/app/contexts/userContext';

function ViewPdf() {

  const ref = useRef<HTMLIFrameElement>(null);

  const router = useRouter();
  const { userValue } = useUserContext();
  const { backgroundImage, backupPdfEditorTemplate } = usePdfEditorContext();

  const returnToHome = () => {
		router.push("/");
	}

	useEffect(() => {
		if (userValue.token === "") {
			returnToHome();
		}
	}, [userValue, router]);

  useEffect(() => {
    async function getPdf() {
      const data = backupPdfEditorTemplate.map(line=>{
            line.style = line.style.replace("left", "flex-start");
            line.style = line.style.replace("right", "flex-end");
            return {
              content: line.value,
              style: {justifyContent: line.style as "flex-start" | "center" | "flex-end"}
            }
      }); 

      const blob = await pdf(pdfGenerator(data,backgroundImage)).toBlob();
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