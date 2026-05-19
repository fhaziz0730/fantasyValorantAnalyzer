import json

with open('../statsRetrieval/myjsonfile.json') as file:
    d=json.loads(file.read()) #your dict
    print(d)