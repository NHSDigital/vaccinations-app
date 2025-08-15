resource "aws_cloudwatch_log_group" "audit_logs_kinesis_firehose_cloudwatch_log_group" {
  name              = "/aws/kinesisfirehose/${var.prefix}-audit-logs"
  retention_in_days = var.log_retention_in_days
}

resource "aws_cloudwatch_log_stream" "audit_logs_kinesis_firehose_cloudwatch_log_stream" {
  name           = "DestinationDelivery"
  log_group_name = aws_cloudwatch_log_group.audit_logs_kinesis_firehose_cloudwatch_log_group.name
}
