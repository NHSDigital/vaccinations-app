data "aws_iam_policy_document" "sns_firehose_alert_forwarder_trust_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "sns_firehose_alert_forwarder_permissions_policy" {
  statement {
    sid    = "AllowSNSPublishToFirehose"
    effect = "Allow"
    actions = [
      "firehose:PutRecord",
      "firehose:PutRecordBatch"
    ]
    resources = [
      aws_kinesis_firehose_delivery_stream.splunk_log_forwarder.arn
    ]
  }
}
