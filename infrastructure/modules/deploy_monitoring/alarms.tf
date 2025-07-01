module "alarm_server_function_4xx_error" {
  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 5.7.1"

  alarm_name          = "${var.prefix}-server-function-4xx-error"
  alarm_description   = "Server Lambda: 4xx Errors"
  alarm_actions       = [module.sns.topic_arn]
  comparison_operator = "GreaterThanThreshold"
  dimensions = {
    FunctionName = "${var.prefix}-server-function"
  }
  evaluation_periods  = 1
  metric_name         = "Url4xxCount"
  namespace           = "AWS/Lambda"
  period              = 300
  ok_actions          = [module.sns.topic_arn]
  statistic           = "Sum"
  threshold           = 0
  treat_missing_data  = "notBreaching"

  tags = var.default_tags
}

module "alarm_server_function_errors" {
  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 5.7.1"

  alarm_name          = "${var.prefix}-server-function-errors"
  alarm_description   = "Server Lambda: Errors"
  alarm_actions       = [module.sns.topic_arn]
  comparison_operator = "GreaterThanThreshold"
  dimensions = {
    FunctionName = "${var.prefix}-server-function"
  }
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  ok_actions          = [module.sns.topic_arn]
  statistic           = "Sum"
  threshold           = 0
  treat_missing_data  = "notBreaching"

  tags = var.default_tags
}

module "alarm_server_function_duration" {
  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 5.7.1"

  alarm_name          = "${var.prefix}-server-function-duration"
  alarm_description   = "Server Lambda: Duration > 2 seconds for p99.5"
  alarm_actions       = [module.sns.topic_arn]
  comparison_operator = "GreaterThanThreshold"
  dimensions = {
    FunctionName = "${var.prefix}-server-function"
  }
  evaluation_periods  = 1
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = 300
  ok_actions          = [module.sns.topic_arn]
  extended_statistic  = "p99.5"
  threshold           = 2000
  unit                = "Milliseconds"
  treat_missing_data  = "notBreaching"

  tags = var.default_tags
}
