import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '../../.env')  # Adjust the path based on your project structure
load_dotenv(dotenv_path=env_path)
smtp_username = os.environ.get('HOST_EMAIL')
smtp_password = os.environ.get('HOST_PASSWORD')


def send_emails_to_guest_list(guest_list, smtp_server='smtp.gmail.com', smtp_port=587, smtp_username=smtp_username, smtp_password=smtp_password):
    # Connect to the SMTP server
    print("Sending Emails...")
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        # Start TLS for security
        server.starttls()

        # Identify ourselves to the server
        server.ehlo()

        # Login to the email account
        server.login(smtp_username, smtp_password)

        # Send the email
            # Create the MIME object
        for guest in guest_list:
            msg = MIMEMultipart()
            msg['From'] = smtp_username
            msg['To'] = guest['guest_email']
            msg['Subject'] = f"Your ticket for {guest['event_name']}"

            # Attach body as plain text
            body = f"Hi {guest['guest_name']},\n\nPlease find attached your ticket for {guest['event_name']}.\n\nSee you there!"
            msg.attach(MIMEText(body, 'plain'))

            # Attach file if provided
            attachment_path = f"api/static/tickets/{guest['event_code']}/E:{guest['event_code']},G:{guest['guest_id']}.png"
            if attachment_path:
                with open(attachment_path, 'rb') as attachment:
                    attachment_part = MIMEApplication(attachment.read(), Name='attached_file.txt')
                    attachment_part['Content-Disposition'] = f'attachment; filename={attachment_path}'
                    msg.attach(attachment_part)
            server.sendmail(smtp_username, guest['guest_email'], msg.as_string())
            print(f"Sent to {guest['guest_email']}")

    print("Emails sent successfully!")
