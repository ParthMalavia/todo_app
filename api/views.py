from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TaskSerialiser

from .models import Task

@api_view(["GET"])
def apioverview(request):
    api_urls = {
        "List": "/task-list/",
        "Detail View": "/task-list/<str:pk>",
        "Create": "/task-create/",
        "Update": "/task-update/<str:pk>",
        "Delete": "/task-delete/<str:pk>",
    }
    return Response(api_urls)


@api_view(["GET"])
def taskList(request):
    tasks = Task.objects.all()
    serialiser = TaskSerialiser(tasks, many=True)
    return Response(serialiser.data)

@api_view(["GET"])
def taskLen(request):
    return Response(len(Task.objects.all()))

@api_view(["GET"])
def taskDetail(request, pk):
    tasks = Task.objects.get(id=pk)
    serialiser = TaskSerialiser(tasks, many=False)
    return Response(serialiser.data)

@api_view(["POST"])
def taskCreate(request):
    # request.data["id"] = len(Task.objects.all())
    serialiser = TaskSerialiser(data=request.data)
    
    if serialiser.is_valid():
        serialiser.save()
    return Response(serialiser.data)

@api_view(["POST"])
def taskUpdate(request, pk):
    task = Task.objects.get(id=pk)
    serialiser = TaskSerialiser(instance=task, data=request.data)
    
    if serialiser.is_valid():
        serialiser.save()
    return Response(serialiser.data)


@api_view(["DELETE"])
def taskDelete(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()
    return Response(f'Deleted the {pk} task')



