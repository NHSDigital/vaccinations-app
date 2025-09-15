resource "aws_cloudwatch_log_subscription_filter" "cloudwatch_to_firehose_server_function_log_forwarder_subscription_filter" {
  name            = "${var.prefix}-cloudwatch-to-firehose-log-filter"
  log_group_name  = "/aws/lambda/${var.prefix}-server-function"
  filter_pattern  = ""
  destination_arn = aws_kinesis_firehose_delivery_stream.splunk_log_forwarder.arn
  role_arn        = aws_iam_role.cloudwatch_to_firehose_subscription_filter_role.arn
  depends_on = [
    aws_iam_role_policy.cloudwatch_to_firehose_log_forwarder_subscription_filter_policy
  ]
}

resource "aws_cloudwatch_log_subscription_filter" "cloudwatch_to_firehose_content_cache_hydrator_function_log_forwarder_subscription_filter" {
  name            = "${var.prefix}-cloudwatch-to-firehose-log-filter"
  log_group_name  = "/aws/lambda/${var.prefix}-content-cache-hydrator"
  filter_pattern  = ""
  destination_arn = aws_kinesis_firehose_delivery_stream.splunk_log_forwarder.arn
  role_arn        = aws_iam_role.cloudwatch_to_firehose_subscription_filter_role.arn
  depends_on = [
    aws_iam_role_policy.cloudwatch_to_firehose_log_forwarder_subscription_filter_policy
  ]
}
