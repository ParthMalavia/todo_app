from django.urls import path
from . import views

urlpatterns = [
    path("", views.apioverview, name="api-overview"),
    path("task-list/", views.taskList, name="task-list"),
    path("task-len/", views.taskLen, name="task-len"),
    path("task-detalis/<str:pk>/", views.taskDetail, name="task-detalis"),
    path("task-create/", views.taskCreate, name="task-create"),
    path("task-update/<str:pk>/", views.taskUpdate, name="task-update"),
    path("task-delete/<str:pk>/", views.taskDelete, name="task-delete"),
]


