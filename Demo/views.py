from django.shortcuts import render
import random

# Create your views here.
def index(request):
    numbers = random.randint(1,9)
    return render(request, "index.html", {'numbers':range(numbers)})