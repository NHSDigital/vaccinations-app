locals {
  audit_logs_cloudwatch_log_group_name = "/aws/kinesisfirehose/${var.prefix}-audit-logs"
  record_schema_json                   = jsondecode(file("${path.module}/schema/record_schema.json"))
  # make sure all keys are lower cased for use as glue table column names
  record_schema_glue = { for k, v in local.record_schema_json.properties : lower(k) => v }
}
