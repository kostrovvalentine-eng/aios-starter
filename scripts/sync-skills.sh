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

# Adapter folders are data in policy.json: one line per harness discovery path.
adapters=()
while IFS= read -r line; do adapters+=("${AIOS_ROOT}/${line}"); done < <(
  node -e 'for (const a of require(process.argv[1]).adapters || []) console.log(a)' "${POLICY_FILE}"
)
if [[ ${#adapters[@]} -eq 0 ]]; then
  printf 'skills/policy.json lists no adapters\n' >&2
  exit 1
fi

for adapter in "${adapters[@]}"; do
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
    rel="$(node -e 'const p=require("path"); console.log(p.relative(process.argv[1], p.join(process.argv[2], "skills", process.argv[3])))' "${adapter}" "${AIOS_ROOT}" "${skill_name}")"
    ln -s "${rel}" "${adapter}/${skill_name}"
  done < <(find "${SKILLS_DIR}" -mindepth 1 -maxdepth 1 -type d -exec test -f '{}/SKILL.md' ';' -print | sort)
done

printf 'Synced AIOS skill adapters.\n'
