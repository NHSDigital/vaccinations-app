resource "aws_iam_policy" "server_lambda_additional_policy" {
  name = "${var.prefix}-server-lambda-additional-policy"
  policy = templatefile("${path.module}/policies/server-lambda-iam-policy.json", {
    region               = var.region,
    account_id           = var.account_id,
    audit_log_group_name = var.audit_log_group_name,
    prefix               = var.prefix
  })
}
