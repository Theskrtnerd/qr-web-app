import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '../../../.env')  # Adjust the path based on your project structure
load_dotenv(dotenv_path=env_path)
smtp_username = os.environ.get('HOST_EMAIL')
smtp_password = os.environ.get('HOST_PASSWORD')


def send_email(sender_email, receiver_email, subject, body, attachment_path=None, smtp_server='smtp.gmail.com', smtp_port=587, smtp_username=smtp_username, smtp_password=smtp_password):
    # Create the MIME object
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject

    # Attach body as plain text
    msg.attach(MIMEText(body, 'plain'))

    # Attach file if provided
    if attachment_path:
        with open(attachment_path, 'rb') as attachment:
            attachment_part = MIMEApplication(attachment.read(), Name='attached_file.txt')
            attachment_part['Content-Disposition'] = f'attachment; filename={attachment_path}'
            msg.attach(attachment_part)

    # Connect to the SMTP server
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        # Start TLS for security
        server.starttls()

        # Identify ourselves to the server
        server.ehlo()

        # Login to the email account
        server.login(smtp_username, smtp_password)

        # Send the email
        server.sendmail(sender_email, receiver_email, msg.as_string())

    print("Email sent successfully!")

# Example usage:
# send_email(sender_email, receiver_email, subject, body, attachment_path, smtp_server, smtp_port, smtp_username, smtp_password)
send_email('tvbbd2@gmail.com', 'tvbzj2@gmail.com', 'This is the 3rd message', 'I\'m testing the email sending functionality')
