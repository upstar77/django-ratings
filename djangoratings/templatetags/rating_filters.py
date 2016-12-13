
from django import template


register = template.Library()

@register.filter
def get_range_reversed_to1(value, start_from=1):
    return reversed(range(start_from, value+1))


