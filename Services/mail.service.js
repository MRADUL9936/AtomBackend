import nodemailer from 'nodemailer'

const transporterFromEmailAuth =()=>{ 

   return nodemailer.createTransport({
    service: 'gmail', // or use another email service
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

}

const sendMail=async(transporter,testName,score,email)=>{

    try{

    const mailOptions = {
    from: process.env.EMAIL,
    to:email,
    subject: 'Test Result',
    html: `
    <html>
      <body>
        <h1>Thank you for taking the test!</h1>
        <h3><strong>Test Name:</strong> ${testName}</h3>
        <h3><strong>Your Score:</strong> ${score}</h3>
      </body>
    </html>
  `   
  };

  await transporter.sendMail(mailOptions);
  console.log(`sent mail securely to ${email}`)
  
    }catch(err){
        console.log("Error ::mail.service.js :: Error sending email",err.message)
        throw err
    }
  
}
export {transporterFromEmailAuth, sendMail}