import { renderToString } from 'react-dom/server';
import { PDFRenderer,pdf, BlobProvider,Document, Page, Image,Text, View, StyleSheet } from '@react-pdf/renderer';
import { NextResponse,NextRequest } from 'next/server'


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
    console.log(wordSplit)
    const arr = []
    if(wordSplit){
      
      console.log(wordSplit)
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

function imageValidation(){

}

export default function pdfGenerator(data:{content:string,style:{textAlign:"left" | "center" | "right"}}[]) {
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
    return (
        <Document>
            <Page size="A4" style={globalStyle.page}>
                <View style={globalStyle.section}>
                    {data.map((line,index)=>{
                      if(line.content === "&#x20;"){
                        return <Text key={"space-"+index} />
                      }

                      let regexImage = /([^"]*)<img height="([^"]*)" width="([^"]*)" title="([^"]*)" src="data:image\/([^"]*);base64,([^"]*)" \/>([^"]*)/;
                      let regexBoldItalic = /(?:\*\*\*([\s\S]*?)\*\*\*|\*\*([\s\S]*?)\*\*|\*([\s\S]*?)\*|<u>([\s\S]*?)<\/u>|([^*]+))/g; //GET BOLD AND ITALIC

                      let wordArr:JSX.Element[] = [];

                      if(line.content.match(regexImage)){
                        const match = line.content.match(regexImage);
                        if(match){
                          console.log(match)
                          const previous = match[1];

                          if(previous != ""){
                            wordArr.push(...boldItalicValidation(regexBoldItalic,previous));
                          }

                          const height = match[2];
                          const width = match[3];
                          const pictureFormt = match[5];
                          const base64Data = match[6];

                          wordArr.push(<Image style={{width,height}} key={"image"+index} src={"data:image/"+pictureFormt+";base64,"+base64Data} />);

                          const next = match[7];

                          if(next != ""){
                            wordArr.push(...boldItalicValidation(regexBoldItalic,next));
                          }      

                        }
                      }else{
                        wordArr.push(...boldItalicValidation(regexBoldItalic,line));
                      }

                      let style: {font:IFont,textDecoration:ITextDecoration,fontSize:string,fontWeigth:IFont,textAlign:"left" | "center" | "right"} = {
                        font: "Times-Roman",
                        textDecoration: "none",
                        fontSize: "16",
                        fontWeigth: "Times-Roman",
                        textAlign: line.style.textAlign
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

                      return <Text key={"line-"+index} style={{
                        textAlign:style.textAlign,
                        fontSize:style.fontSize,
                        fontFamily:style.fontWeigth,
                        display:"flex"
                      }}>{wordArr}</Text>
                    })}
                </View>
            </Page>
        </Document>
    ); 
}
