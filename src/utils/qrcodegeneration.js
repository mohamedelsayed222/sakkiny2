import QRCode from 'qrcode'

export const generateQrcod=({data=''}={})=>{

    const qrcode=QRCode.toDataURL(JSON.stringify(data),
    {
        errorCorrectionLevel: 'L'
    })
    return qrcode
}