resource "aws_iam_policy" "audit_logs_kinesis_iam_policy" {
  name = "${var.prefix}-audit-log-kinesis-iam-policy"
  policy = templatefile("${path.module}/policies/audit-kinesis-firehose-iam-policy.json", {
    s3_bucket_arn           = module.audit_logs_s3_bucket.s3_bucket_arn,
    account_id              = var.account_id,
    region                  = var.region,
    log_group               = local.audit_logs_cloudwatch_log_group_name,
    glue_database_arn       = aws_glue_catalog_database.audit_logs_glue_database.arn,
    firehose_conversion_arn = aws_glue_catalog_table.audit_logs_firehose_conversion.arn
  })
}

resource "aws_iam_role" "audit_logs_kineses_iam_role" {
  name               = "${var.prefix}-audit-log-kinesis-iam-role"
  assume_role_policy = templatefile("${path.module}/policies/audit-kinesis-firehose-iam-role.json", {})
}

resource "aws_iam_role_policy_attachment" "audit_logs_iam_role_policy_attachment" {
  role       = aws_iam_role.audit_logs_kineses_iam_role.name
  policy_arn = aws_iam_policy.audit_logs_kinesis_iam_policy.arn
}
