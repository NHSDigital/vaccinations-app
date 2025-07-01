resource "aws_chatbot_slack_channel_configuration" "this" {
  configuration_name    = "${var.prefix}-alarms-to-slack"
  slack_team_id         = data.aws_chatbot_slack_workspace.alarms_slack_workspace.slack_team_id
  slack_channel_id      = var.alarms_slack_channel_id
  sns_topic_arns        = [module.sns.topic_arn]
  iam_role_arn          = aws_iam_role.chatbot_iam_role.arn
  guardrail_policy_arns = ["arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess"]
  tags = var.default_tags
}
