locals {
  alarms_lambda = {
    "server-lambda-4xx-error" = {
      alarm_description = "Server Lambda: 4xx error within last hour"
      metric_name       = "Url4xxCount"

      statistic           = "Sum"
      extended_statistic  = null // as statistic is used
      comparison_operator = "GreaterThanThreshold"
      threshold           = 5
      unit                = "Count"

      period              = 60 // 1min
      evaluation_periods  = 60 // 60 periods
      datapoints_to_alarm = 1  // number of breaches within the last evaluation period to alarm
    },

    "server-lambda-uncaught-errors" = {
      alarm_description = "Server Lambda: uncaught exception within last hour"
      metric_name       = "Errors"

      statistic           = "Sum"
      extended_statistic  = null // as statistic is used
      comparison_operator = "GreaterThanThreshold"
      threshold           = 0
      unit                = "Count"

      period              = 60 // 1min
      evaluation_periods  = 60 // 60 periods
      datapoints_to_alarm = 1  // number of breaches within the last evaluation period to alarm
    },

    "server-lambda-request-latency" = {
      alarm_description = "Server Lambda: request latency > 2sec for p99.5 within last hour"
      metric_name       = "UrlRequestLatency"

      statistic           = null // as extended_statistic is used
      extended_statistic  = "p99.5"
      comparison_operator = "GreaterThanThreshold"
      threshold           = 2
      unit                = "Seconds"

      period              = 600 // 10min
      evaluation_periods  = 6   // 6 periods
      datapoints_to_alarm = 1   // number of breaches within the last evaluation period to alarm
    },

    "server-lambda-5xx-error" = {
      alarm_description = "Server Lambda: 5xx error within last hour"
      metric_name       = "Url5xxCount"

      statistic           = "Sum"
      extended_statistic  = null // as statistic is used
      comparison_operator = "GreaterThanThreshold"
      threshold           = 0
      unit                = "Count"

      period              = 60 // 1min
      evaluation_periods  = 60 // 60 periods
      datapoints_to_alarm = 1  // number of breaches within the last evaluation period to alarm
    },

    "server-lambda-throttles" = {
      alarm_description = "Server Lambda: concurrent request throttle limit hit within last hour"
      metric_name       = "Throttles"

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

module "alarms_lambda" {
  for_each = local.alarms_lambda

  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 5.0"

  alarm_name        = "${var.prefix}-${each.key}"
  alarm_description = each.value.alarm_description

  namespace   = "AWS/Lambda"
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
    FunctionName = "${var.prefix}-server-function"
  }

  tags = var.default_tags
}
