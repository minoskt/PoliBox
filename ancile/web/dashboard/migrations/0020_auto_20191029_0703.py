# Generated by Django 2.2.4 on 2019-10-29 03:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0019_auto_20191019_0134'),
    ]

    operations = [
        migrations.AlterField(
            model_name='permissiongroup',
            name='scopes',
            field=models.ManyToManyField(blank=True, to='dashboard.Scope'),
        ),
    ]
