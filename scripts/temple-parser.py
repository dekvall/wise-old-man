#!/usr/bin/env python3

import argparse
import json
import requests
import sys
from string import Template
from bs4 import BeautifulSoup
import re
from dateutil import parser as dateparser

parser = argparse.ArgumentParser(description="Dump datapoints from templeOsrs")
parser.add_argument(
    "username", action="store", help="your username",
)
parser.add_argument(
    "-q", "--quiet", dest="quiet", action="store_true", help="do not display output"
)
parser.add_argument(
    "-o",
    "--output-file",
    dest="outfile",
    action="store",
    help="output result to a file",
)

args = vars(parser.parse_args())

ENDPOINT = Template(
    "https://templeosrs.com/player/updatetable.php?player=$name&duration=alltime"
)

if not args["quiet"]:
    print(
        f"Looking up player {args['username']}...", file=sys.stderr,
    )

response = requests.get(ENDPOINT.substitute(name=args["username"].replace(" ", "+")))

if response.status_code != 200:
    response.raise_for_status()

soup = BeautifulSoup(response.content, "html.parser")
table = soup.find(id="update-table-container")

if table is None:
    raise ValueError(f"Player {args['username']} have no records on temple")

entries = table.findAll("div", {"class": "update-table-xp"})
details = [entry["title"].strip().split("\n") for entry in entries]


records = []
record = dict()
for detail in details:
    if len(detail) == 1:
        # This is a timetamp
        if "timestamp" in record:
            records.append(record)
            record = dict()
        record["timestamp"] = dateparser.parse(detail[0]).isoformat()
    else:
        skill, xp = detail[0], detail[2]
        if "Ehp" in skill:
            continue
        record[skill.lower()] = int(xp.replace(",", ""))

if not args["quiet"]:
    print(
        f"Got {len(records)} snapshots for player {args['username']} between {records[-1]['timestamp']} and {records[0]['timestamp']}",
        file=sys.stderr,
    )
outfile = args["outfile"]
if outfile is None:
    print(json.dumps(records))
else:
    with open(outfile, "w") as out:
        json.dump(records, out)
