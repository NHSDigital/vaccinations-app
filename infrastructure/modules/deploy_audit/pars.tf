resource "aws_cloudwatch_log_group" "audit_log_group" {
  name              = var.audit_log_group_name
  retention_in_days = var.audit_log_retention_in_days
}

resource "aws_cloudwatch_log_stream" "audit_log_stream" {
  name           = var.audit_log_stream_name
  log_group_name = aws_cloudwatch_log_group.audit_log_group.name
}

resource "aws_cloudwatch_log_subscription_filter" "pars" {
  count = var.enable_pars ? 1 : 0

  name            = "${var.prefix}-pars-logfilter"
  log_group_name  = aws_cloudwatch_log_group.audit_log_group.name
  filter_pattern  = "{$.resourceType=AuditEvent}"
  destination_arn = "arn:aws:logs:eu-west-2:${var.pars_account_id}:destination:nhs-main-pars-clwint-${var.pars_target_environment_name}"
  role_arn        = aws_iam_role.audit-logs-pars-subscription-role.arn
}

data "aws_iam_policy_document" "audit-logs-assume-role-restrict-document" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["logs.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]

    condition {
      test     = "StringLike"
      variable = "aws:SourceArn"
      values   = ["arn:aws:logs:eu-west-2:${var.pars_account_id}:*"]
    }
  }
}

data "aws_iam_policy_document" "audit-logs-pars-subscription-allow-document" {
  statement {
    sid    = "EnablePutSubscriptionFilterOnPARSDestination"
    effect = "Allow"
    actions = [
      "logs:PutSubscriptionFilter",
    ]
    resources = [
      "arn:aws:logs:*:*:log-group:*",
      "arn:aws:logs:eu-west-2:${var.pars_account_id}:destination:nhs-main-pars-clwint-${var.pars_target_environment_name}"
    ]
  }
}

resource "aws_iam_policy" "audit-logs-pars-subscription-allow-policy" {
  name   = "${var.prefix}-audit-logs-pars-subscription-allow-policy"
  policy = data.aws_iam_policy_document.audit-logs-pars-subscription-allow-document.json
}

resource "aws_iam_role_policy_attachment" "audit-logs-iam-role-policy-attachment" {
  role       = aws_iam_role.audit-logs-pars-subscription-role.name
  policy_arn = aws_iam_policy.audit-logs-pars-subscription-allow-policy.arn
}

resource "aws_iam_role" "audit-logs-pars-subscription-role" {
  name               = "${var.prefix}-audit-logs-pars-subscription-role"
  path               = "/"
  assume_role_policy = data.aws_iam_policy_document.audit-logs-assume-role-restrict-document.json
}
