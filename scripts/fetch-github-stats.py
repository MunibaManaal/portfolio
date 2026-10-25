"""
Fetch GitHub stats for the portfolio and save them to data/github-stats.json.

Run from the "portfolio site" folder:
    python3 scripts/fetch-github-stats.py
The token is read from the GITHUB_TOKEN environment variable, never from a file.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

USER = "Muniba-Manaal"          # the account the stats come from
TOP_LANGUAGES = 3               # languages shown before "Other"
RECENT_COMMITS = 4              # commits shown in the list

TOKEN = os.environ.get("GITHUB_TOKEN")
OUTPUT = Path(__file__).resolve().parent.parent / "data" / "github-stats.json"
LEVELS = {"NONE": 0, "FIRST_QUARTILE": 1, "SECOND_QUARTILE": 2,
          "THIRD_QUARTILE": 3, "FOURTH_QUARTILE": 4}


def api(url, body=None):
    """Call the GitHub API and return the JSON response."""
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "portfolio-stats",
    }
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=data, headers=headers)
    with urllib.request.urlopen(request) as response:
        return json.load(response)


def contribution_calendar():
    """The contribution grid for the last year (includes private counts if enabled on the profile)."""
    query = """
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount contributionLevel } }
          }
        }
      }
    }"""
    result = api("https://api.github.com/graphql", {"query": query, "variables": {"login": USER}})
    if "errors" in result:
        raise RuntimeError(result["errors"])
    calendar = result["data"]["user"]["contributionsCollection"]["contributionCalendar"]
    weeks = [
        [{"date": d["date"], "count": d["contributionCount"], "level": LEVELS[d["contributionLevel"]]}
         for d in week["contributionDays"]]
        for week in calendar["weeks"]
    ]
    return calendar["totalContributions"], weeks


def current_streak(weeks):
    """Days in a row with at least one contribution, counting back from today.
    If today has no contributions yet, the streak counts from yesterday."""
    days = [d for week in weeks for d in week]
    today = datetime.now(timezone.utc).date().isoformat()
    days = [d for d in days if d["date"] <= today]
    if days and days[-1]["count"] == 0 and days[-1]["date"] == today:
        days = days[:-1]
    streak = 0
    for d in reversed(days):
        if d["count"] == 0:
            break
        streak += 1
    return streak


def public_repos():
    """All public repositories owned by the user (forks excluded)."""
    repos, page = [], 1
    while True:
        batch = api(f"https://api.github.com/users/{USER}/repos?type=owner&sort=pushed&per_page=100&page={page}")
        repos += batch
        if len(batch) < 100:
            break
        page += 1
    return [r for r in repos if not r["fork"]]


def language_shares(repos):
    """Share of repositories per main language, e.g. Python 40%."""
    counts = Counter(r["language"] for r in repos if r["language"])
    total = sum(counts.values())
    if not total:
        return []
    top = counts.most_common(TOP_LANGUAGES)
    shares = [{"name": name, "percent": round(n * 100 / total)} for name, n in top]
    other = 100 - sum(s["percent"] for s in shares)
    if len(counts) > TOP_LANGUAGES and other > 0:
        shares.append({"name": "Other", "percent": other})
    return shares


def pull_requests_to_others():
    """Number of pull requests the user opened in other people's public repositories."""
    q = urllib.parse.quote(f"type:pr author:{USER} -user:{USER}")
    return api(f"https://api.github.com/search/issues?q={q}&per_page=1")["total_count"]


def recent_commits(repos):
    """The user's latest commits across their most recently pushed public repos."""
    commits = []
    for repo in repos[:8]:
        url = f"https://api.github.com/repos/{repo['full_name']}/commits?author={USER}&per_page=3"
        try:
            items = api(url)
        except urllib.error.HTTPError:      # e.g. an empty repository
            continue
        for item in items:
            message = item["commit"]["message"].splitlines()[0]
            commits.append({
                "repo": repo["name"],
                "message": message[:60] + ("…" if len(message) > 60 else ""),
                "date": item["commit"]["author"]["date"],
            })
    commits.sort(key=lambda c: c["date"], reverse=True)
    return commits[:RECENT_COMMITS]


def main():
    if not TOKEN:
        sys.exit("GITHUB_TOKEN is not set. Run:  export GITHUB_TOKEN=your_token  and try again.")

    print(f"Fetching stats for {USER}…")
    total, weeks = contribution_calendar()
    user = api(f"https://api.github.com/users/{USER}")
    repos = public_repos()

    stats = {
        "user": USER,
        "updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "total": total,
        "streak": current_streak(weeks),
        "repos": user["public_repos"],
        "busiest": max((d["count"] for week in weeks for d in week), default=0),
        "stars": sum(r["stargazers_count"] for r in repos),
        "weeks": weeks,
        "languages": language_shares(repos),
        "commits": recent_commits(repos),
    }
      # "prs": pull_requests_to_others(),  will add this stat later if needed. 

    OUTPUT.parent.mkdir(exist_ok=True)
    OUTPUT.write_text(json.dumps(stats, indent=2))
    print(f"Saved to {OUTPUT}")
    print(f"  contributions: {stats['total']}  streak: {stats['streak']}  repos: {stats['repos']}  "
          f"busiest day: {stats['busiest']}  stars: {stats['stars']}")


if __name__ == "__main__":
    main()