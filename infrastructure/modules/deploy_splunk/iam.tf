// IAM permissions for Firehose that forwards logs to Splunk
resource "aws_iam_role" "firehose_splunk_log_forwarder_role" {
  name               = "${var.prefix}-firehose-splunk-log-forwader-role"
  assume_role_policy = data.aws_iam_policy_document.firehose_splunk_log_forwarder_trust_policy.json
}

resource "aws_iam_role_policy" "firehose_splunk_log_forwarder_policy" {
  name   = "${var.prefix}-firehose-splunk-log-forwarder-policy"
  policy = data.aws_iam_policy_document.firehose_splunk_log_forwarder_permissions_policy.json
  role   = aws_iam_role.firehose_splunk_log_forwarder_role.id
}


// IAM permissions for CloudWatch subscription that forwards logs to firehose
resource "aws_iam_role" "cloudwatch_to_firehose_subscription_filter_role" {
  name               = "${var.prefix}-log-forwarder-subscription-filter-role"
  assume_role_policy = data.aws_iam_policy_document.cloudwatch_subscription_filter_trust_policy.json
}

resource "aws_iam_role_policy" "cloudwatch_to_firehose_log_forwarder_subscription_filter_policy" {
  name   = "${var.prefix}-log-forwarder-subscription-filter-policy"
  policy = data.aws_iam_policy_document.cloudwatch_subscription_filter_permissions_policy.json
  role   = aws_iam_role.cloudwatch_to_firehose_subscription_filter_role.id
}
