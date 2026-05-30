import random
from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer


class UserViewSet(viewsets.ViewSet):
    def register(self, request):
        serializer = UserSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            errors = {k: str(v[0]) for k, v in e.__dict__['detail'].items()}
            return Response(errors)
        serializer.save()
        return Response({'Response': 'Succeed'}, status=status.HTTP_201_CREATED)

    def list(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def login(self, request):
        try:
            print(request.COOKIES)

            user = User.objects.get(account=request.data['account'])
            if user.password != request.data.get('password'):
                return Response({'Response': 'Fail login due to incorrect account or password'},
                                status=status.HTTP_401_UNAUTHORIZED)
            if user.login_token is not None and user.login_token == request.COOKIES.get('login_token'):
                return Response({'Response': 'You have already logged in before', 'name': user.name})
            login_token = request.session._get_or_create_session_key()
            serializer = UserSerializer(instance=user, data={'login_token': login_token}, partial=True)
            serializer.is_valid(raise_exception=True)
            # You cannot call `.save()` after accessing `serializer.data`.If you need to access data before committing to the database then inspect 'serializer.validated_data' instead.
            serializer.save()  # Song.objects.update(request.data)
            response = Response({'Response': 'Successful login', 'name': user.name})
            if request.data.get('keepLogin')==True:
                response.set_cookie("login_token", request.session._get_or_create_session_key(),max_age=86400)  # Remain logged in for 3600 seconds
            else:
                response.set_cookie("login_token", request.session._get_or_create_session_key())
            return response
        except Exception as e:
            return Response({'Response': 'Fail login due to incorrect account or password'},
                            status=status.HTTP_401_UNAUTHORIZED)

    def logout(self, request):
        print(request.COOKIES)

        user = User.objects.get(login_token=request.COOKIES['login_token'])
        serializer = UserSerializer(instance=user, data={'login_token': None}, partial=True)
        serializer.is_valid(raise_exception=True)
        # You cannot call `.save()` after accessing `serializer.data`.If you need to access data before committing to the database then inspect 'serializer.validated_data' instead.
        serializer.save()  # Song.objects.update(request.data)
        response = Response({'Response': 'Successful logout'})
        response.delete_cookie("login_token")
        return response

    def token_logged_in_user(self, request):
        try:
            if request.COOKIES.get('login_token') is None:
                return Response({'Response': 'Not logged in'})

            user = User.objects.get(login_token=request.COOKIES.get('login_token'))

            return Response({'Response': 'Successful login', 'name': user.name,'account':user.account})
        except:
            return Response({'Response': 'Not logged in'})
