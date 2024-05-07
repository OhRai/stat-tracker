from django.urls import path
from . import views

urlpatterns = [
    path('', views.AllUsersView.as_view(), name='all-users'),
    path('<int:player_id>', views.UserView.as_view(), name='user-info'),
    path('current/<int:player_id>', views.UserInfoHistoryView.as_view(), name='current-stats'),
    path('history/<int:player_id>', views.UserAllHist.as_view(), name='user-history'),
]