from django.conf.urls import url

from .views import rate_object

urlpatterns = [
    url(r'(?P<content_type_id>[-\d]+)/(?P<object_id>[-\d]+)/(?P<score>[-\d]+)/$', rate_object, name='rate_object'),
]
