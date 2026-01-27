output "alerting_sns_topic_arn" {
  value = module.sns.topic_arn
}

output "alerting_global_sns_topic_arn" {
  value = module.sns_global.topic_arn
}
