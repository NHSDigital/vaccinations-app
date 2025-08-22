locals {
  alarms_lambda_logs = {
    "content-cache-hydrator-error-logs" = {
      alarm_description = "Content Cache Hydrator: error level log in last run"
      metric_name       = "ContentCacheHydratorErrorLogs"

      statistic           = "Sum"
      comparison_operator = "GreaterThanThreshold"
      threshold           = 0
      unit                = "Count"

      period              = 60 // 1min
      evaluation_periods  = 1  // immediate feedback when turns OK
      datapoints_to_alarm = 1
      treat_missing_data  = "ignore" // maintain alarm state
    }
  }
}

resource "aws_cloudwatch_log_metric_filter" "content_cache_hydrator_error_logs" {
  name           = "Content Cache Hydrator error logs"
  pattern        = "{ $.level = \"ERROR\" }"
  log_group_name = "/aws/lambda/${var.prefix}-content-cache-hydrator"

  metric_transformation {
    name          = local.alarms_lambda_logs.content-cache-hydrator-error-logs.metric_name
    namespace     = var.prefix
    value         = "1"
    default_value = "0"
    unit          = "Count"
  }
}

module "alarms_logs" {
  for_each = local.alarms_lambda_logs

  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 5.7.1"

  alarm_name        = "${var.prefix}-${each.key}"
  alarm_description = each.value.alarm_description

  namespace   = var.prefix
  metric_name = each.value.metric_name

  statistic           = each.value.statistic
  comparison_operator = each.value.comparison_operator
  threshold           = each.value.threshold
  unit                = each.value.unit

  period              = each.value.period
  evaluation_periods  = each.value.evaluation_periods
  datapoints_to_alarm = each.value.datapoints_to_alarm
  treat_missing_data  = each.value.treat_missing_data

  alarm_actions = [var.alerting_sns_topic_arn]
  ok_actions    = [var.alerting_sns_topic_arn]

  tags = var.default_tags
}
