module "firehose_transformer_lambda_function" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 7.21.1"

  function_name = "${var.prefix}-firehose-transformer"
  description   = "Firehose Lambda transformer for sending formatted logs to splunk"
  handler       = "lambda.handler"

  runtime = var.python_version
  timeout = 60

  lambda_role = aws_iam_role.firehose_splunk_log_forwarder_role.arn
  source_path = "${path.module}/files"

  cloudwatch_logs_retention_in_days = var.splunk_log_retention_in_days
  cloudwatch_logs_skip_destroy      = true
  logging_log_format                = "JSON"

  tags = var.default_tags
}
