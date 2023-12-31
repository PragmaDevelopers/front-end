/* Need to create a Base64 Encoder and a Base 64 Decoder to work with imagens */

export function encodeBase64(file: File, callback: (base64String: string) => void): void {
    let fileReader = new FileReader();
    fileReader.onload = () => {
        let source = fileReader.result as string;
        callback(source);
    };

    fileReader.readAsDataURL(file);
}

export function decodeBase64(base64String: string): string {
  return `data:image/png;base64,${base64String}`;
}
