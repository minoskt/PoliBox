from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth import REDIRECT_FIELD_NAME

def user_is_developer(f, redirect_field_name=REDIRECT_FIELD_NAME, login_url=None):
    decorator = user_passes_test(lambda u: u.is_developer,
                                 login_url=login_url,
                                 redirect_field_name=redirect_field_name)
    return decorator(f)

def user_is_admin(f, redirect_field_name=REDIRECT_FIELD_NAME, login_url=None):
    decorator = user_passes_test(lambda u: u.is_superuser,
                                 login_url=login_url,
                                 redirect_field_name=redirect_field_name)
    return decorator(f)