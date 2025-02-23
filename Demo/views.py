from django.shortcuts import render
from django.http import HttpResponse
import random

# Create your views here.
def index(request):
    numbers = random.randint(1,9)
    return render(request, "index.html", {'numbers':range(numbers)})

def store(request):
    if request.method == 'POST':
        data = {}
        for key, value in request.POST.items():
            if key.startswith('editor_'):
                editor_number = key.replace('editor_', '')
                data[editor_number] = value

        return HttpResponse(f"Data received successfully: {data}")
    return HttpResponse("Invalid request")