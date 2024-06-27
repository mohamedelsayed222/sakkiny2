import { Vonage } from '@vonage/server-sdk'
import dotenv from 'dotenv'
dotenv.config()
const vonage = new Vonage({
  apiKey: "ca09dc68",
  apiSecret: process.env.Api_Secret_Vonage
})
const sendSMS=async({from="Vonage APIs",to,text})=>{
   return await vonage.sms.send({to:`+2${to}`, from, text})
        .then(resp => { console.log('Message sent successfully');
          console.log(resp);
          return true
        })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); 
          return false
        });
}
export default sendSMS



