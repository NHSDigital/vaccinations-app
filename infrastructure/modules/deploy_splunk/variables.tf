variable "prefix" {
  type        = string
  description = "Prefix to be applied to resources created"
}

variable "default_tags" {
  type        = map(string)
  description = "Map of default key-value pair of tags to add to resources"
}

variable "splunk_log_retention_in_days" {
  type        = string
  description = "The retention of logs in cloudwatch log groups in days"
}

variable "account_id" {
  type        = string
  description = "AWS Account Id"
}

variable "region" {
  type        = string
  description = "The AWS region to deploy to"
}

variable "alerting_sns_topic_arn" {
  type        = string
  description = "SNS topic identifier for alerting"
}

variable "alerting_global_sns_topic_arn" {
  type        = string
  description = "Global SNS topic identifier for alerting"
}

variable "python_version" {
  type        = string
  description = "Python Version of lambda runtime to run firehose formatter function"
}
