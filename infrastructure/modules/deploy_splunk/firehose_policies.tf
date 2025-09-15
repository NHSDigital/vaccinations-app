data "aws_iam_policy_document" "firehose_splunk_log_forwarder_trust_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["firehose.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "firehose_splunk_log_forwarder_permissions_policy" {
  statement {
    sid    = "AllowFirehoseS3Backup"
    effect = "Allow"
    actions = [
      "s3:AbortMultipartUpload",
      "s3:GetBucketLocation",
      "s3:ListBucket",
      "s3:ListBucketMultipartUploads",
      "s3:PutObject",
      "s3:GetObject"
    ]
    resources = [
      "${module.failed_firehose_delivery_logs_s3_bucket.s3_bucket_arn}/*",
      module.failed_firehose_delivery_logs_s3_bucket.s3_bucket_arn,
    ]
  }

  statement {
    sid    = "AllowFirehoseInvokeTransformerLambda"
    effect = "Allow"
    actions = [
      "lambda:InvokeFunction",
      "lambda:GetFunctionConfiguration",
    ]
    resources = [
    "${module.firehose_transformer_lambda_function.lambda_function_arn}:$LATEST"]
  }

  statement {
    sid    = "AllowFirehoseCloudWatchLogging"
    effect = "Allow"
    actions = [
      "logs:PutLogEvents"
    ]
    resources = [
      aws_cloudwatch_log_stream.splunk_firehose_logs_stream.arn
    ]
  }
}
