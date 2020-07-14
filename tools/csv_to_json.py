import csv
import json
import sys

if len(sys.argv) != 3:
    print('Expected 2 args, input csv and output json.')
    exit(1)

toWrite = []
with open(sys.argv[1], newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        filteredRow = {k: v for k, v in row.items() if v is not ''}
        toWrite.append(filteredRow)
    json_dump = json.dumps(toWrite)
    f = open(sys.argv[2], 'w')
    f.write(json_dump)
    f.close()