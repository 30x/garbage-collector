import requests
from urlparse import urljoin
from os import environ as env

EXTERNAL_SCHEME = env['EXTERNAL_SCHEME']
BASE_URL = '%s://%s:%s' % (EXTERNAL_SCHEME, env['EXTERNAL_SY_ROUTER_HOST'], env['EXTERNAL_SY_ROUTER_PORT']) if 'EXTERNAL_SY_ROUTER_PORT' in env else '%s://%s' % (EXTERNAL_SCHEME, env['EXTERNAL_SY_ROUTER_HOST'])

def main():
    url = urljoin(BASE_URL, '/trash-pickup-requests')

    request = {
        "isA": "TrashPickupRequest",
        "trashItem": "DonaldTrump",
        "trashItemType": "Map"
    }

    r = requests.post(url, json=request)
    if r.status_code == 200:
        print 'correctly sent request to pick up trash'
    else:
        print 'failed to send request to pick up trash. status_code: %s text: %s' % (r.status_code, r.text)

if __name__ == '__main__':
    main()    