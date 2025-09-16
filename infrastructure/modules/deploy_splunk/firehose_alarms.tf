locals {
  alarms_firehose = {
    "firehose-to-splunk-delivery-errors" = {
      alarm_description = "Operational Logs: Firehose to Splunk delivery error within last hour"
      metric_name       = "DeliveryToS3.Success"
      delivery_stream   = aws_kinesis_firehose_delivery_stream.splunk_log_forwarder.name

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

module "alarms_firehose" {
  for_each = local.alarms_firehose

  source  = "terraform-aws-modules/cloudwatch/aws//modules/metric-alarm"
  version = "~> 5.7.1"

  alarm_name        = "${var.prefix}-${each.key}"
  alarm_description = each.value.alarm_description

  namespace   = "AWS/Firehose"
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
    DeliveryStreamName = each.value.delivery_stream
  }

  tags = var.default_tags
}
