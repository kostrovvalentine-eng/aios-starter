#!/usr/bin/env bash

set -euo pipefail

AIOS_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="${AIOS_ROOT}/skills"
POLICY_FILE="${SKILLS_DIR}/policy.json"

if [[ ! -f "${POLICY_FILE}" ]]; then
  printf 'Missing skill policy: %s\n' "${POLICY_FILE}" >&2
  exit 1
fi

is_hidden() {
  local candidate="$1"
  node -e 'const p=require(process.argv[1]); process.exit((p.hidden_from_discovery || []).includes(process.argv[2]) ? 0 : 1)' "${POLICY_FILE}" "${candidate}"
}

for adapter in "${AIOS_ROOT}/.agents/skills" "${AIOS_ROOT}/.claude/skills"; do
  mkdir -p "${adapter}"
  while IFS= read -r existing; do
    if [[ -L "${existing}" ]]; then
      rm "${existing}"
    else
      printf 'Refusing to overwrite non-symlink adapter: %s\n' "${existing}" >&2
      exit 1
    fi
  done < <(find "${adapter}" -mindepth 1 -maxdepth 1 -print | sort)

  while IFS= read -r skill_dir; do
    skill_name="$(basename "${skill_dir}")"
    is_hidden "${skill_name}" && continue
    ln -s "../../skills/${skill_name}" "${adapter}/${skill_name}"
  done < <(find "${SKILLS_DIR}" -mindepth 1 -maxdepth 1 -type d -exec test -f '{}/SKILL.md' ';' -print | sort)
done

printf 'Synced AIOS skill adapters.\n'
