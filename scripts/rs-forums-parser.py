#!/usr/bin/env python3
import argparse
import json

from bs4 import BeautifulSoup
import re
import sys
from dateutil import parser as dateparser
import time

# Grequests needs to be monkey patched to not infinitely recure on SSL
from gevent import monkey as curious_george

curious_george.patch_all(thread=False, select=False)

import requests
import grequests

FORUMS_URL_PATTERN = re.compile(
    r"^(https://secure\.runescape\.com/m=forum/forums\?\d{3},\d{3},\d{3},\d{8})(?:,goto,\d+)?$"
)
FORUMS_QFC_PATTERN = re.compile(r"^\d{3}-\d{3}-\d{3}-\d{8}$")
LAST_EDIT_PATTERN = re.compile(r"^- Last edited on (.+) by .+$")
POSTS_PER_PAGE = 10


def qfc_to_url(qfc):
    return f"https://secure.runescape.com/m=forum/forums?{qfc.replace('-', ',')}"


def grab_posts_from_page(pageidx, page):
    posts = page.findAll("article")
    result = []
    for idx, post in enumerate(posts):
        created, lastedited = extract_post_timeinfo(post)
        p = {
            "id": POSTS_PER_PAGE * pageidx + idx,
            "onpage": pageidx + 1,
            "poster": extract_poster(post),
            "message": extract_post_message(post),
            "created": created,
            "lastedited": lastedited,
        }
        result.append(p)

    return result


def extract_post_message(post):
    message = post.find("span", {"class": "forum-post__body"})

    for br in message.find_all("br"):
        # Jagex wraps some messages with <br> for some reason
        if not br.isSelfClosing:
            br.unwrap()
        else:
            br.replace_with("\n")
    # Remove trailing whitespace
    content = message.get_text()
    return "\n".join((line.strip() for line in content.split("\n")))


def extract_poster(post):
    name = post.find("h3", {"class": "post-avatar__name"})
    if name is not None:
        return name["data-displayname"]
    return None


def extract_post_timeinfo(post):
    timeinfo = post.find("p", {"class": "forum-post__time-below"}).get_text()
    if timeinfo is None:
        return None, None

    times = timeinfo.strip().split("\n")

    created = dateparser.parse(times[0]).isoformat()
    if len(times) == 1:
        return created, None

    m = LAST_EDIT_PATTERN.match(times[1])
    if m:
        last_updated = dateparser.parse(m.group(1)).isoformat()
    else:
        last_updated = None

    return created, last_updated


def rsforums_thread(arg_value):
    urlmatch = FORUMS_URL_PATTERN.match(arg_value)
    if urlmatch:
        return urlmatch.group(1)
    elif FORUMS_QFC_PATTERN.match(arg_value):
        return qfc_to_url(arg_value)
    raise argparse.ArgumentTypeError("thread must be either forum thread url or qfc")


parser = argparse.ArgumentParser(description="dump an RSforums thread to json")
parser.add_argument(
    "thread",
    action="store",
    type=rsforums_thread,
    help="the forums url or qfc to parse",
)
parser.add_argument(
    "-q", "--quiet", dest="quiet", action="store_true", help="Do not display output"
)
parser.add_argument(
    "-o",
    "--output-file",
    dest="outfile",
    action="store",
    help="output result to a file",
)
parser.add_argument(
    "-w",
    "--workers",
    action="store",
    dest="workers",
    type=int,
    default=5,
    help="set the amount of workers to fetch webpages",
)

args = vars(parser.parse_args())

response = requests.get(args["thread"])

if response.status_code != 200:
    response.raise_for_status()

soup = BeautifulSoup(response.content, "html.parser")

not_found = soup.find("p", {"class": "forum-error"})

if not_found:
    raise ValueError(f'The thread {args["thread"]} cannot be found')

n_pages = int(soup.find("input", {"class": "forum-pagination__input-number"})["max"])

if not args["quiet"]:
    print(f"Found thread with {n_pages} pages", file=sys.stderr)
    start = time.time()

urls = [f"{args['thread']},goto,{pagenum}" for pagenum in range(1, n_pages + 1)]

rs = (grequests.get(u) for u in urls)

reqs = grequests.map(rs, size=args["workers"])

pages = (BeautifulSoup(r.content, "html.parser") for r in reqs)

threadposts = []
for pageidx, page in enumerate(pages):
    threadposts += grab_posts_from_page(pageidx, page)

info = {
    "thread": args["thread"],
    "qfc": args["thread"].split("?")[-1].replace(",", "-"),
    "pagecount": n_pages,
    "postcount": len(threadposts),
    "posts": threadposts,
}

if not args["quiet"]:
    print(
        f"Dumped {n_pages} pages with {len(threadposts)} posts in {time.time()-start:.1f} seconds",
        file=sys.stderr,
    )

outfile = args["outfile"]
if outfile is None:
    print(json.dumps(info))
else:
    with open(outfile, "w") as out:
        json.dump(info, out)
