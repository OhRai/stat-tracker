from rest_framework.views import APIView
from rest_framework.response import Response

from .models import User, UserInfoHistory
from .serializers import UserSerializer, UserInfoHistorySerializer

from django.core.exceptions import ObjectDoesNotExist

from datetime import datetime

from ossapi import Ossapi

client = Ossapi(30209, '3RKAR3MPesZTDulgYLGylQc4Txew5HNhlfpHVTC1')

# General User Info
class UserView(APIView):
    def get(self, request, player_id, format=None):
        try:
            user = User.objects.get(player_id=player_id)
        except ObjectDoesNotExist:
            user_data = client.user(player_id, mode='osu')
            user = User(
                player_id=player_id,
                username=user_data.username,
                pfp = user_data.avatar_url,
                country=user_data.country_code,
                joined=user_data.join_date,
                rank=user_data.statistics.global_rank,
                pp=user_data.statistics.pp,
                playcount=user_data.statistics.play_count,
                level=user_data.statistics.level.current,
                playstyle=user_data.playstyle or 0,
                location=user_data.location or 'None',
                occupation=user_data.occupation or 'None',
                interests=user_data.interests or 'None',
                twitter=user_data.twitter or '',
                discord=user_data.discord or ''
            )
            user.save()

            hist = UserInfoHistory(
                player_id=user,
                date=datetime.now().date(),
                rank=user_data.statistics.global_rank,
                pp=user_data.statistics.pp,
                playcount=user_data.statistics.play_count,
                ssh_count=user_data.statistics.grade_counts.ssh,
                ss_count=user_data.statistics.grade_counts.ss,
                sh_count=user_data.statistics.grade_counts.sh,
                s_count=user_data.statistics.grade_counts.s
            )
            hist.save()
        else:
            user_data = client.user(user.player_id, mode='osu')
            user.username = user_data.username
            user.pfp = user_data.avatar_url
            user.country = user_data.country_code
            user.joined = user_data.join_date
            user.rank = user_data.statistics.global_rank
            user.pp = user_data.statistics.pp
            user.playcount = user_data.statistics.play_count
            user.level = user_data.statistics.level.current
            user.playstyle = user_data.playstyle or 0
            user.location = user_data.location or 'None'
            user.occupation = user_data.occupation or 'None'
            user.interests = user_data.interests or 'None'
            user.twitter = user_data.twitter or ''
            user.discord = user_data.discord or ''
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data)

# This view adds a new entry to the UserInfoHistory table based on date and player_id
class UserInfoHistoryView(APIView):
    def get(self, request, player_id, format=None):
        try:
            user = User.objects.get(player_id=player_id)
        except ObjectDoesNotExist:
            user_data = client.user(player_id, mode='osu')
            user = User(
                player_id=player_id,
                username=user_data.username,
                country=user_data.country_code,
                joined=user_data.join_date,
                rank=user_data.statistics.global_rank,
                pp=user_data.statistics.pp,
                playcount=user_data.statistics.play_count,
                level=user_data.statistics.level.current
            )
            user.save()

        hist_data = client.user(player_id, mode='osu')
        hist_entry = {
            'date': datetime.now().date(),
            'rank': hist_data.statistics.global_rank,
            'pp': hist_data.statistics.pp,
            'playcount': hist_data.statistics.play_count,
            'ssh_count': hist_data.statistics.grade_counts.ssh,
            'ss_count': hist_data.statistics.grade_counts.ss,
            'sh_count': hist_data.statistics.grade_counts.sh,
            's_count': hist_data.statistics.grade_counts.s,
        }

        try:
            hist = UserInfoHistory.objects.get(player_id=user, date=datetime.now())
            hist.rank = hist_entry['rank']
            hist.pp = hist_entry['pp']
            hist.playcount = hist_entry['playcount']
            hist.ssh_count = hist_entry['ssh_count']
            hist.ss_count = hist_entry['ss_count']
            hist.sh_count = hist_entry['sh_count']
            hist.s_count = hist_entry['s_count']
            hist.save()
        except ObjectDoesNotExist:
            hist = UserInfoHistory(
                player_id=user,
                date=datetime.now().date(),
                rank=hist_entry['rank'],
                pp=hist_entry['pp'],
                playcount=hist_entry['playcount'],
                ssh_count=hist_entry['ssh_count'],
                ss_count=hist_entry['ss_count'],
                sh_count=hist_entry['sh_count'],
                s_count=hist_entry['s_count'],
            )
            hist.save()

        serializer = UserInfoHistorySerializer(hist, many=False)
        return Response(serializer.data)
    
# View All Users
class AllUsersView(APIView):
    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
# This view lets you see all the historical data from a player_id
class UserAllHist(APIView):
    def get(self, request, player_id, format=None):
        user = User.objects.get(player_id=player_id)
        hist = UserInfoHistory.objects.filter(player_id=user)
        serializer = UserInfoHistorySerializer(hist, many=True)
        return Response(serializer.data)