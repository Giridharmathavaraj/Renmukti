import nodemailer from 'nodemailer';

nodemailer.createTestAccount().then(async account => {
  console.log("Acquired Ethereal Account...");
  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"LOS Updates" <giridharmathavaraj@gmail.com>',
      to: "testclient@example.com",
      subject: "Backend Test: Confirming Email Dispatch Pipeline",
      text: "Hello! This email confirms that the system logic correctly fires emails from giridharmathavaraj@gmail.com and is securely captured by the Ethereal testing sandbox."
    });
    console.log("Email Successfully Sent!");
    console.log("-------------------------------------------------");
    console.log("Open this URL in your browser to view the email: ");
    console.log(nodemailer.getTestMessageUrl(info));
    console.log("-------------------------------------------------");
  } catch (err) {
    console.error("Test Failed:", err);
  }
}).catch(console.error);
