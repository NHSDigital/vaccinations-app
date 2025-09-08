data "aws_iam_policy_document" "cloudwatch_subscription_filter_trust_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["logs.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]

    condition {
      test     = "StringLike"
      variable = "aws:SourceArn"
      values   = ["arn:aws:logs:${var.region}:${var.account_id}:*"]
    }
  }
}

data "aws_iam_policy_document" "cloudwatch_subscription_filter_permissions_policy" {
  statement {
    effect = "Allow"
    actions = [
      "firehose:PutRecord",
      "firehose:PutRecordBatch"
    ]
    resources = [aws_kinesis_firehose_delivery_stream.splunk_log_forwarder.arn]
  }
}
