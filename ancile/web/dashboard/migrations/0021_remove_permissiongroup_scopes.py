# Generated by Django 2.2.4 on 2019-11-06 22:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0020_auto_20191029_0703'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='permissiongroup',
            name='scopes',
        ),
    ]
