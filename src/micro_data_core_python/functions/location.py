from src.micro_data_core_python.decorators import transform_decorator
from geopy.distance import distance


def _in_geofence(pt1, pt2, radius):
    return distance(pt1, pt2).m <= radius

