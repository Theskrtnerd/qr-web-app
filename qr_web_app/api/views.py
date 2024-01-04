from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Event, Guest
from .utils.qr_codes import generate_qr_codes_for_event, decode_data
from .utils.tickets import generate_tickets_guest_list
from .utils.send_emails import send_emails_to_guest_list
from .serializers import EventSerializer, CreateEventSerializer, GuestSerializer, CreateGuestSerializer

class EventView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class GuestView(generics.ListAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer


class CreateEventView(APIView):
    serializer_class = CreateEventSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            name = serializer.validated_data.get('name')
            description = serializer.validated_data.get('description')
            date = serializer.validated_data.get('date')
            location = serializer.validated_data.get('location')
            link = serializer.validated_data.get('link')

            event = Event.objects.create(
                name=name,
                description=description,
                date=date,
                location=location,
                link=link
            )

            return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateGuestView(APIView):
    serializer_class = CreateGuestSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            name = serializer.validated_data.get('name')
            email = serializer.validated_data.get('email')
            ticket_checked = serializer.validated_data.get('ticketChecked')
            event_code = request.data.get('eventCode')

            # Retrieve the event using the 'GetEvent' view
            # event_view = GetEvent()
            # event_response = event_view.get(request, code=event_code)
            # print(event_response.data)
            event = Event.objects.get(code=event_code)

            guest = Guest.objects.create(
                event=event,
                name=name,
                email=email,
                ticketChecked=ticket_checked
            )

            return Response(CreateGuestSerializer(guest).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateGuestListView(APIView):
    serializer_class = CreateGuestSerializer  # Use the CreateGuestSerializer for validation

    def post(self, request, *args, **kwargs):
        event_code = request.data.get('eventCode')
        event = Event.objects.get(code=event_code)
        guests_data = request.data.get("guests", [])

        # Delete previous guests related to the event
        Guest.objects.filter(event=event).delete()

        # Serialize and save the new guest list using the specified serializer
        new_guests = []
        for guest_data in guests_data:
            serializer = self.serializer_class(data=guest_data)
            if serializer.is_valid():
                name = serializer.validated_data.get('name')
                email = serializer.validated_data.get('email')
                ticket_checked = serializer.validated_data.get('ticketChecked')

                guest = Guest.objects.create(
                    event=event,
                    name=name,
                    email=email,
                    ticketChecked=ticket_checked
                )

                new_guests.append(CreateGuestSerializer(guest).data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Guests updated successfully", "new_guests": new_guests}, status=status.HTTP_200_OK)

    
class GetGuestList(APIView):
    def get(self, request, format=None):
        eventCode = request.GET.get('eventCode')
        if eventCode != None:
            event = Event.objects.filter(code=eventCode)
            if len(event) > 0:
                guests = Guest.objects.filter(event=event[0])
                return Response(GuestSerializer(guests, many=True).data, status=status.HTTP_200_OK)
            return Response({'Guest Not Found': 'Invalid Event Code.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    
class GetEvent(APIView):
    serializer_class = EventSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        eventCode = request.GET.get(self.lookup_url_kwarg)
        if eventCode != None:
            event = Event.objects.filter(code=eventCode)
            if len(event) > 0:
                data = EventSerializer(event[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Event Not Found': 'Invalid Event Code.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    

class SendEmailToGuestList(APIView):
    def post(self, request, *args, **kwargs):
        event_code = request.data.get('eventCode')
        event = Event.objects.get(code=event_code)
        guests_data = Guest.objects.filter(event=event)
        new_guests = []
        guests_tickets = []
        for guest_data in guests_data:
            new_guests.append({
                "id": guest_data.id,
                "name": guest_data.name,
                "email": guest_data.email,
                "ticketChecked": guest_data.ticketChecked
            })
            guests_tickets.append({
                "event_name": event.name,
                "guest_email": guest_data.email,
                "guest_name": guest_data.name,
                "guest_id": guest_data.id,
                "event_location": event.location,
                "event_date": event.date.date(),
                "event_time": event.date.time().strftime('%I:%M %p'),
                "event_code": event_code,
            })
        generate_qr_codes_for_event(new_guests, event_code)
        generate_tickets_guest_list(guests_tickets)
        send_emails_to_guest_list(guests_tickets)

        return Response({"message": "Generated QR Codes"}, status=status.HTTP_200_OK)

class CheckGuestView(APIView):
    def post(self, request, *args, **kwargs):
        qr_code_data = request.data.get('qrCodeData')
        event_code, guest_id = decode_data(qr_code_data)
        if(event_code == None or guest_id == None):
            return Response({"message": "Invalid QR Code"}, status=status.HTTP_200_OK)
        event = Event.objects.get(code=event_code)
        guest = Guest.objects.get(id=guest_id, event=event)
        if(guest.ticketChecked):
            return Response({"message": "Guest Already Checked! Please Try Again"}, status=status.HTTP_200_OK)
        guest.ticketChecked = True
        guest.save()
        return Response({"message": "Checked Guest Successfully!"}, status=status.HTTP_200_OK)