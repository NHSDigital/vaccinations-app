resource "aws_sns_topic_subscription" "sns_to_firehose_subscription" {
  topic_arn             = var.alerting_sns_topic_arn
  protocol              = "firehose"
  endpoint              = aws_kinesis_firehose_delivery_stream.splunk_log_forwarder.arn
  subscription_role_arn = aws_iam_role.sns_to_firehose_subscription_filter_role.arn
  raw_message_delivery  = false
}

# For Cloudfront Alarms which are in global region
resource "aws_sns_topic_subscription" "global_sns_to_firehose_subscription" {
  topic_arn             = var.alerting_global_sns_topic_arn
  protocol              = "firehose"
  endpoint              = aws_kinesis_firehose_delivery_stream.splunk_log_forwarder.arn
  subscription_role_arn = aws_iam_role.sns_to_firehose_subscription_filter_role.arn
  raw_message_delivery  = false
  region                = "us-east-1"
  provider              = aws.global
}
