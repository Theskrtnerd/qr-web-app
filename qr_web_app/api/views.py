from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Event, Guest
from .serializers import EventSerializer, CreateEventSerializer, GuestSerializer

class EventView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class GuestView(generics.CreateAPIView):
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
