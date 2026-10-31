"""Evaluate the configured image classifier against a labelled CSV.

CSV columns: image_path,class_id. Relative image paths are resolved from the CSV folder.
"""

import argparse
import csv
import json
import sys
from collections import Counter
from pathlib import Path

from PIL import Image, ImageOps

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from app import CONFIDENCE_THRESHOLD, load_classifier


def evaluate(csv_path, threshold):
    rows = []
    with csv_path.open(newline="", encoding="utf-8-sig") as source:
        reader = csv.DictReader(source)
        if not {"image_path", "class_id"}.issubset(reader.fieldnames or []):
            raise ValueError("CSV must include image_path and class_id columns.")
        for line_number, row in enumerate(reader, start=2):
            image_path = Path(row["image_path"])
            if not image_path.is_absolute():
                image_path = csv_path.parent / image_path
            label = (row["class_id"] or "").strip()
            if not label:
                raise ValueError(f"Missing class_id on CSV line {line_number}.")
            rows.append((image_path, label))
    if not rows:
        raise ValueError("CSV contains no labelled images.")

    classifier = load_classifier()
    class_counts = Counter()
    confusion = {}
    accepted = 0
    accepted_correct = 0
    top_one_correct = 0
    top_three_correct = 0
    false_confident = []

    for image_path, expected in rows:
        with Image.open(image_path) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGB")
            outputs = classifier(image, top_k=3)
        if isinstance(outputs, dict):
            outputs = [outputs]
        if not outputs:
            raise RuntimeError(f"Model returned no labels for {image_path.name}.")
        predictions = [(item["label"], float(item["score"])) for item in outputs]
        predicted, score = predictions[0]
        class_counts[expected] += 1
        confusion.setdefault(expected, Counter())[predicted] += 1
        is_top_one = predicted == expected
        is_top_three = expected in {label for label, _ in predictions}
        top_one_correct += int(is_top_one)
        top_three_correct += int(is_top_three)
        if score >= threshold:
            accepted += 1
            accepted_correct += int(is_top_one)
            if not is_top_one:
                false_confident.append({
                    "image": image_path.name,
                    "expected": expected,
                    "predicted": predicted,
                    "raw_model_score": round(score, 4),
                })

    predicted_counts = Counter()
    for actual, predictions in confusion.items():
        for predicted, count in predictions.items():
            predicted_counts[predicted] += count
    class_metrics = {}
    for label in sorted(set(class_counts) | set(predicted_counts)):
        true_positive = confusion.get(label, Counter()).get(label, 0)
        precision_denominator = predicted_counts[label]
        recall_denominator = class_counts[label]
        precision = true_positive / precision_denominator if precision_denominator else 0.0
        recall = true_positive / recall_denominator if recall_denominator else 0.0
        f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
        class_metrics[label] = {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1": round(f1, 4),
            "support": recall_denominator,
        }

    count = len(rows)
    return {
        "sample_count": count,
        "sample_size_warning": "SMALL SAMPLE: do not generalise these results." if count < 30 else None,
        "threshold_raw_model_score": threshold,
        "top1_accuracy": round(top_one_correct / count, 4),
        "top3_accuracy": round(top_three_correct / count, 4),
        "accepted_count": accepted,
        "accepted_coverage": round(accepted / count, 4),
        "uncertainty_coverage": round((count - accepted) / count, 4),
        "accuracy_among_accepted": round(accepted_correct / accepted, 4) if accepted else None,
        "confusion_matrix": {label: dict(sorted(predictions.items())) for label, predictions in sorted(confusion.items())},
        "per_class": class_metrics,
        "false_confidence_examples": false_confident,
        "note": "Evaluation only reflects this supplied labelled CSV. It is not evidence of general field accuracy.",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_file", type=Path, help="CSV with image_path,class_id columns")
    parser.add_argument("--threshold", type=float, default=CONFIDENCE_THRESHOLD)
    parser.add_argument("--output", type=Path, help="Optional path for the JSON report")
    args = parser.parse_args()
    if not 0 <= args.threshold <= 1:
        parser.error("--threshold must be between 0 and 1.")
    try:
        report = evaluate(args.csv_file.resolve(), args.threshold)
    except (OSError, ValueError, RuntimeError) as error:
        parser.error(str(error))
    output = json.dumps(report, indent=2, ensure_ascii=False)
    print(output)
    if args.output:
        args.output.write_text(output + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
