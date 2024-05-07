from rest_framework import serializers
from .models import User, UserInfoHistory

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserInfoHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfoHistory
        fields = '__all__'