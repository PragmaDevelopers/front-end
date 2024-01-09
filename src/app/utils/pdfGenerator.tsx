 "use client"

import { renderToString } from 'react-dom/server';
import { PDFRenderer,pdf, BlobProvider,Document, Page, Image,Text, View, StyleSheet } from '@react-pdf/renderer';
import { PdfLineStyleProps } from '../interfaces/RegisterClientInterfaces';
import { useRef } from 'react';


type IFont = "Times-Roman" | "Times-Bold" | "Times-Italic" | "Times-BoldItalic";
type ITextDecoration = "line-through" | "underline" | "none" | "line-through underline" | "underline line-through";


function boldItalicValidation(regex:RegExp,line:any){
  let style: {font:IFont,textDecoration:ITextDecoration,fontSize:string,fontWeigth:IFont} = {
    font: "Times-Roman",
    textDecoration: "none",
    fontSize: "16",
    fontWeigth: "Times-Roman"
  }

  if(line.content.match(/^[#]{1,6} ([\s\S]*?)/)){
    line = line.replace(/^[#]{1,6} ([\s\S]*?)/,"$1")
  }
  
  let wordSplit = line.content.match(regex);
  const arr = []
  if(wordSplit){
    for(let i = 0;i < wordSplit.length;i++){
      let word = wordSplit[i];
      if (word.match(/\*\*\*([\s\S]*?)\*\*\*/g)) {
        word = word.replace(/\*\*\*(.*?)\*\*\*/g,"$1");
        style.font = "Times-BoldItalic";
      } else if (word.match(/\*\*([\s\S]*?)\*\*/g)) {
        word = word.replace(/\*\*(.*?)\*\*/g,"$1");
        style.font = "Times-Bold";
      } else if (word.match(/\*([^*]+)\*/g)) {
        word = word.replace(/\*(.*?)\*/g,"$1");
        style.font = "Times-Italic";
      }

      if(word.match(/<u>([\s\S]*?)<\/u>/g)){
        word = word.replace(/<u>(.*?)<\/u>/g,"$1");
        style.textDecoration = "underline";
      }

      arr.push(<Text key={"word-"+i} style={{fontFamily:style.font,textDecoration:style.textDecoration }}>{word}</Text>);

      style.font = "Times-Roman";
      style.textDecoration = "none";
    }
  }
  return arr;
}

export default function pdfGenerator(data:PdfLineStyleProps[],backgroundImage:string|undefined) {
  const globalStyle = StyleSheet.create({
      page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF"
      },
      section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        gap: 15
      },
      h1: {
        fontSize: 12,
        textAlign:"center"
      },
      h2: {
        fontSize: 12,
        textAlign:"center",
        marginTop:10
      },
      textRed: {
        color: "red"
      },
      textUppercase: {
        textTransform: "uppercase"
      },
      line: {
        borderTop: 1, 
        borderColor: 'black',
        marginTop: 30,
      },
      p: {
        fontSize: 12,
        marginTop: 10
      },
  });

  
  const regexImage = /([^"]*)<img height="([^"]*)" width="([^"]*)" src="data:image\/([^"]*);base64,([^"]*)" \/>([^"]*)/;
  const regexBackgroundImage = /<img className="([^"]*)" height="([^"]*)" width="([^"]*)" src="data:image\/([^"]*);base64,([^"]*)" \/>/;
  const regexBoldItalic = /(?:\*\*\*([\s\S]*?)\*\*\*|\*\*([\s\S]*?)\*\*|\*([\s\S]*?)\*|<u>([\s\S]*?)<\/u>|([^*]+))/g; //GET BOLD AND ITALIC

  return (
      <Document>
        <Page size="A4" style={globalStyle.page}>
          {
            backgroundImage?.match(regexBackgroundImage) && (
              <View fixed={true}>
                <Image src={backgroundImage} />
              </View>
            )
          }
          <View style={globalStyle.section}>
            {
              data.map((line,index)=>{
                if(line.content === "&#x20;"){
                  return <Text key={"space-"+index} />
                }

                let wordArr:JSX.Element[] = [];

                if(line.content.match(regexImage)){
                  const match = line.content.match(regexImage);
                  if(match){
                    console.log(match)
                    const previous = {
                      style: line.style,
                      content:match[1]
                    };

                    if(previous.content != ""){
                      wordArr.push(...boldItalicValidation(regexBoldItalic,previous));
                    }

                    const height = match[2] != "{{height}}" ? match[2] : "inherit";
                    const width = match[3] != "{{width}}" ? match[3] : "inherit";
                    const pictureFormt = match[4];
                    const base64Data = match[5];

                    wordArr.push(<Image style={{height,width}} key={"image"+index} src={"data:image/"+pictureFormt+";base64,"+base64Data} />);

                    const next = {
                      style: line.style,
                      content:match[6]
                    };

                    if(next.content != ""){
                      wordArr.push(...boldItalicValidation(regexBoldItalic,next));
                    }      

                  }
                }else{
                  wordArr.push(...boldItalicValidation(regexBoldItalic,line));
                }

                let style: {font:IFont,textDecoration:ITextDecoration,fontSize:string,fontWeigth:IFont,justifyContent:"flex-start" | "center" | "flex-end"} = {
                  font: "Times-Roman",
                  textDecoration: "none",
                  fontSize: "16",
                  fontWeigth: "Times-Roman",
                  justifyContent: line.style.justifyContent
                }

                if(line.content.match(/^[#]{1,6} ([\s\S]*?)/)){
                  if(line.content.match(/^[#]{1} ([\s\S]*?)/)){
                    style.fontSize = "32";
                    style.fontWeigth = "Times-Bold"
                  }else if(line.content.match(/^[#]{2} ([\s\S]*?)/)){
                    style.fontSize = "24";
                    style.fontWeigth = "Times-Bold"
                  }else if(line.content.match(/^[#]{3} ([\s\S]*?)/)){
                    style.fontSize = "18.72";
                    style.fontWeigth = "Times-Bold"
                  }else if(line.content.match(/^[#]{4} ([\s\S]*?)/)){
                    style.fontSize = "16";
                    style.fontWeigth = "Times-Bold"
                  }else if(line.content.match(/^[#]{5} ([\s\S]*?)/)){
                    style.fontSize = "13.28";
                    style.fontWeigth = "Times-Bold"
                  }else if(line.content.match(/^[#]{6} ([\s\S]*?)/)){
                    style.fontSize = "13";
                  }
                }

                return <View key={"line-"+index} style={{
                  justifyContent:style.justifyContent,
                  fontSize:style.fontSize,
                  fontFamily:style.fontWeigth,
                  display:"flex",
                  flexDirection: "row",
                  alignItems: "flex-end"
                }}>{wordArr}</View>
              })
            }
          </View>
        </Page>     
      </Document>
  ); 
}
