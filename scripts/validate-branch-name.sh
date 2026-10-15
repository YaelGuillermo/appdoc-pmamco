#!/usr/bin/env sh
set -eu

branch="${1:-$(git branch --show-current)}"

if [ -z "$branch" ]; then
  echo '[git-policy] Cannot determine the current branch.' >&2
  exit 1
fi

case "$branch" in
  main|master)
    echo '[git-policy] Direct pushes to main/master are not allowed. Open a PR.' >&2
    exit 1
    ;;
esac

if ! printf '%s\n' "$branch" | grep -Eq '^(feat|fix|refactor|chore|docs|test|perf|build|ci)/[a-z0-9][a-z0-9._-]*$'; then
  echo "[git-policy] Invalid branch name: $branch" >&2
  echo '[git-policy] Use e.g. feat/academy-quality or fix/spanish-routes.' >&2
  exit 1
fi

echo "[git-policy] Valid branch: $branch"
