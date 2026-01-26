resource "aws_chatbot_slack_channel_configuration" "this" {
  count = var.is_local ? 0 : 1

  configuration_name    = "${var.prefix}-alarms-to-slack-${var.environment}"
  slack_team_id         = data.aws_chatbot_slack_workspace.alarms_slack_workspace.slack_team_id
  slack_channel_id      = var.alarms_slack_channel_id
  sns_topic_arns        = [module.sns.topic_arn, module.sns_global.topic_arn]
  iam_role_arn          = aws_iam_role.chatbot_iam_role.arn
  guardrail_policy_arns = ["arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess"]
  tags                  = var.default_tags

  depends_on = [module.sns, aws_iam_role.chatbot_iam_role]
}
