module "alarm_server_function_4xx_error" {
  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "5.7.1"

  alarm_name          = "${var.prefix}-server-function-4xx-error"
  alarm_description   = "Server Lambda: 4xx Errors"
  comparison_operator = "GreaterThanThreshold"
  dimensions = {
    FunctionName = "${var.prefix}-server-function"
  }
  evaluation_periods  = 1
  metric_name         = "Url4xxCount"
  namespace           ="AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 0
  treat_missing_data  = "notBreaching"

  tags = var.default_tags
}
