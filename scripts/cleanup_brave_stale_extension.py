#!/usr/bin/env python3

import argparse
import json
import shutil
from pathlib import Path


def load_json(path: Path) -> dict:
    with path.open() as f:
        return json.load(f)


def save_json(path: Path, data: dict) -> None:
    with path.open("w") as f:
        json.dump(data, f, separators=(",", ":"))


def remove_nested(mapping: dict, keys: list[str]) -> bool:
    current = mapping
    for key in keys[:-1]:
        current = current.get(key)
        if not isinstance(current, dict):
            return False
    return current.pop(keys[-1], None) is not None


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Remove stale Brave extension entries from Preferences."
    )
    parser.add_argument(
        "--preferences",
        default=str(Path.home() / ".config/BraveSoftware/Brave-Browser/Default/Preferences"),
        help="Path to Brave Preferences file.",
    )
    parser.add_argument(
        "--extension-id",
        required=True,
        help="Extension ID to remove from Brave Preferences.",
    )
    parser.add_argument(
        "--no-backup",
        action="store_true",
        help="Skip writing a .bak backup next to Preferences.",
    )
    args = parser.parse_args()

    preferences_path = Path(args.preferences)
    if not preferences_path.exists():
        raise SystemExit(f"Preferences file not found: {preferences_path}")

    if not args.no_backup:
        backup_path = preferences_path.with_name(preferences_path.name + ".bak")
        shutil.copy(preferences_path, backup_path)
        print(f"Backup saved to {backup_path}")

    prefs = load_json(preferences_path)
    extension_id = args.extension_id

    removed = False
    removed |= remove_nested(prefs, ["extensions", "settings", extension_id])
    removed |= remove_nested(
        prefs,
        ["protection", "macs", "extensions", "settings", extension_id],
    )
    removed |= remove_nested(
        prefs,
        ["protection", "macs", "extensions", "settings_encrypted_hash", extension_id],
    )

    if not removed:
        print(f"No stale entries found for {extension_id}")
        return 0

    save_json(preferences_path, prefs)
    print(f"Removed stale Brave preferences for {extension_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
