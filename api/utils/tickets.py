from PIL import Image, ImageDraw, ImageFont
import os

def create_ticket(guest_data):
    # Open the ticket template image
    template_path = "api/static/ticket_template.png"  # Update this with the actual path
    ticket_template = Image.open(template_path)

    # Load a font (you may need to provide the path to a font file)
    font_path = "api/static/font.ttf"

    # Create a drawing object
    draw = ImageDraw.Draw(ticket_template)

    # Set the color
    primary = "#5cba95"
    background = "#f4f8f6"

    # Add event name
    draw.text((702, 142), guest_data['event_name'], font=ImageFont.truetype(font_path, size=54), fill=background)
    draw.text((702, 250), guest_data['guest_name'], font=ImageFont.truetype(font_path, size=90), fill=primary)
    draw.text((702, 358), 'GUEST NO. '+str(guest_data['guest_id']), font=ImageFont.truetype(font_path, size=40), fill=primary)
    draw.text((702, 445), 'LOCATION: '+guest_data['event_location'], font=ImageFont.truetype(font_path, size=50), fill=primary)
    draw.text((702, 510), 'DATE: '+str(guest_data['event_date']), font=ImageFont.truetype(font_path, size=50), fill=primary)
    draw.text((702, 575), 'TIME: '+str(guest_data['event_time']), font=ImageFont.truetype(font_path, size=50), fill=primary)


    # Load the QR code image
    qr_code_path = f"api/static/qr_codes/{guest_data['event_code']}/E:{guest_data['event_code']},G:{guest_data['guest_id']}.png"  # Update this with the actual path
    qr_code = Image.open(qr_code_path)
    qr_code = qr_code.resize((568, 568))
    # Paste the QR code onto the ticket template
    ticket_template.paste(qr_code, (70, 70))

    # Save the new ticket image
    directory_path = f"api/static/tickets/{guest_data['event_code']}/"

    # Check if the directory exists, create it if not
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)

    output_path = f"api/static/tickets/{guest_data['event_code']}/E:{guest_data['event_code']},G:{guest_data['guest_id']}.png"
    ticket_template.save(output_path)

def generate_tickets_guest_list(guest_list):
    for guest_data in guest_list:
        create_ticket(guest_data)
