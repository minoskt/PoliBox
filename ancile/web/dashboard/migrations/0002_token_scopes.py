# Generated by Django 2.2.3 on 2019-07-26 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='token',
            name='scopes',
            field=models.ManyToManyField(to='dashboard.Scope'),
        ),
    ]