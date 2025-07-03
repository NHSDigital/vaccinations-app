locals {
  alarms_cloudfront = {
    "cloudfront-4xx-error-rate" = {
      alarm_description   = "Cloudfront: 4xx error rate within last hour"
      metric_name         = "4xxErrorRate"

      statistic           = "Average"
      extended_statistic  = null // as statistic is used
      comparison_operator = "GreaterThanThreshold"
      threshold           = 0.5
      unit                = "Percent"

      period              = 600 // 10min
      evaluation_periods  = 6 // 6 periods
      datapoints_to_alarm = 1 // number of breaches within the last evaluation period to alarm
    },

    "cloudfront-5xx-error-rate" = {
      alarm_description   = "Cloudfront: uncaught exception within last hour"
      metric_name         = "5xxErrorRate"

      statistic           = "Average"
      extended_statistic  = null // as statistic is used
      comparison_operator = "GreaterThanThreshold"
      threshold           = 0.5
      unit                = "Percent"

      period              = 600 // 10min
      evaluation_periods  = 6 // 6 periods
      datapoints_to_alarm = 1 // number of breaches within the last evaluation period to alarm
    }
  }
}

module "alarms_cloudfront" {
  for_each = local.alarms_cloudfront

  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 5.7.1"

  alarm_name          = "${var.prefix}-${each.key}"
  alarm_description   = each.value.alarm_description

  namespace           = "AWS/CloudFront"
  metric_name         = each.value.metric_name

  statistic           = each.value.statistic
  extended_statistic  = each.value.extended_statistic
  comparison_operator = each.value.comparison_operator
  threshold           = each.value.threshold
  unit                = each.value.unit

  period              = each.value.period
  evaluation_periods  = each.value.evaluation_periods
  datapoints_to_alarm = each.value.datapoints_to_alarm

  alarm_actions       = [module.sns.topic_arn]
  ok_actions          = [module.sns.topic_arn]
  treat_missing_data  = "notBreaching"

  dimensions = {
    DistributionId = var.cloudfront_distribution_id
  }

  tags = var.default_tags
}
