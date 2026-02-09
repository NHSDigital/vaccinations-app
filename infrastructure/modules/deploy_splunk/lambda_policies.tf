data "aws_iam_policy_document" "firehose_transformer_lambda_to_firehose_trust_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]

    condition {
      test     = "StringLike"
      variable = "aws:SourceArn"
      values = [
        "arn:aws:lambda:${var.region}:${var.account_id}:function:${var.prefix}-firehose-transformer"
      ]
    }
  }
}

data "aws_iam_policy_document" "firehose_transformer_lambda_to_firehose_permissions_policy" {
  statement {
    effect = "Allow"
    actions = [
      "firehose:PutRecord",
      "firehose:PutRecordBatch"
    ]
    resources = [aws_kinesis_firehose_delivery_stream.splunk_log_forwarder.arn]
  }

  statement {
    effect  = "Allow"
    actions = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = [
      "arn:aws:logs:${var.region}:${var.account_id}:log-group:/aws/lambda/${var.prefix}-firehose-transformer:*",
      "arn:aws:logs:${var.region}:${var.account_id}:log-group:/aws/lambda/${var.prefix}-firehose-transformer"
    ]
  }
}
