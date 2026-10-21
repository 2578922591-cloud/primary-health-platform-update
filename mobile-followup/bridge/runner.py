from __future__ import annotations
import argparse, json, pathlib, sys

def main() -> int:
    p = argparse.ArgumentParser(description="公卫平台录入执行器（安全预演版）")
    p.add_argument("queue", type=pathlib.Path)
    p.add_argument("--execute", action="store_true", help="仅在完成平台校准后可用")
    args = p.parse_args()
    queue = json.loads(args.queue.read_text(encoding="utf-8"))
    mapping = json.loads(pathlib.Path(__file__).with_name("platform-map.json").read_text(encoding="utf-8"))
    if args.execute:
        if not mapping.get("verified"):
            raise SystemExit("拒绝执行：平台字段顺序尚未在测试环境逐项校准。")
        raise SystemExit("执行模块尚未启用；当前版本永久保留人工保存。")
    for record in queue.get("records", []):
        print(f"[{record['type']}] {record['patient_name']} / {record['archive_no']} -> {record['window_title']}")
        for n, step in enumerate(record["steps"], 1):
            print(f"  {n:02d}. {step['field']} = {step['value']}")
        print("  最终动作：人工核对并保存\n")
    return 0

if __name__ == "__main__":
    sys.exit(main())

