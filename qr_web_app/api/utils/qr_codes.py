import segno
import base64
import os

# Data to pass into qrcode, event_code, guest_id

def encode_data(event_code, guest_id):
    data = f"E:{event_code},G:{guest_id}"
    encoded_data = base64.urlsafe_b64encode(data.encode()).decode()
    return encoded_data

def decode_data(encoded_data):
    try:
        decoded_data = base64.urlsafe_b64decode(encoded_data).decode()
        event_code = decoded_data.split(',')[0].split(':')[1]
        guest_id = int(decoded_data.split(',')[1].split(':')[1])
        return event_code, guest_id
    except:
        return None, None

def generate_qr_code(data, filename):
    qr_code = segno.make(data)
    qr_code.save(filename, scale=10, border=2)

def generate_qr_codes_for_event(guestList, event_code):
    directory_path = f"api/static/qr_codes/{event_code}/"

    # Check if the directory exists, create it if not
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)
    for guest in guestList:
        guest_id = guest['id']
        encoded_data = encode_data(event_code, guest_id)
        filename = f"E:{event_code},G:{guest_id}.png"
        generate_qr_code(encoded_data, f"{directory_path}{filename}")
