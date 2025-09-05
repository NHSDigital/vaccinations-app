locals {
  alarms_cloudwatch = {
    "cloudwatch-to-firehose-subscription-delivery-errors" = {
      alarm_description = "Operational Logs: Cloudwatch to Firehose delivery error within last hour"
      metric_name       = "DeliveryErrors"
      log_group         = "/aws/lambda/${var.prefix}-server-function"

      statistic           = "Sum"
      extended_statistic  = null // as statistic is used
      comparison_operator = "GreaterThanThreshold"
      threshold           = 0
      unit                = "Count"

      period              = 60 // 1min
      evaluation_periods  = 60 // 60 periods
      datapoints_to_alarm = 1  // number of breaches within the last evaluation period to alarm
    },
  }
}

module "alarms_cloudwatch" {
  for_each = local.alarms_cloudwatch

  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 5.7.1"

  alarm_name        = "${var.prefix}-${each.key}"
  alarm_description = each.value.alarm_description

  namespace   = "AWS/Logs"
  metric_name = each.value.metric_name

  statistic           = each.value.statistic
  extended_statistic  = each.value.extended_statistic
  comparison_operator = each.value.comparison_operator
  threshold           = each.value.threshold
  unit                = each.value.unit

  period              = each.value.period
  evaluation_periods  = each.value.evaluation_periods
  datapoints_to_alarm = each.value.datapoints_to_alarm

  alarm_actions      = [var.alerting_sns_topic_arn]
  ok_actions         = [var.alerting_sns_topic_arn]
  treat_missing_data = "notBreaching"

  dimensions = {
    LogGroupName    = each.value.log_group
    DestinationType = "Firehose"
    FilterName      = each.key
  }

  tags = var.default_tags
}
