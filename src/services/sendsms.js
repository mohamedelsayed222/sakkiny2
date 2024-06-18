import { Vonage } from '@vonage/server-sdk'
const vonage = new Vonage({
  apiKey: "b986c9c3",
  apiSecret: process.env.Api_Secret_Vonage
})
const sendSMS=async({from="Vonage APIs",to,text})=>{
    await vonage.sms.send({to:`2${to}`, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}
export default sendSMS



