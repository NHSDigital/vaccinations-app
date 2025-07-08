variable "prefix" {
  type        = string
  description = "Prefix to be applied to resources created"
}

variable "environment" {
  type        = string
  description = "Environment to deploy resources into"
}

variable "default_tags" {
  type        = map(string)
  description = "Map of default key-value pair of tags to add to resources"
}

variable "alarms_slack_channel_id" {
  type        = string
  description = "Channel ID of the Slack channel where alarms would be sent"
}

variable "cloudfront_distribution_id" {
  type        = string
  description = "The ID of the cloudfront distribution"
}

variable "is_local" {
  type        = bool
  description = "Useful for turning off certain parts of monitoring for local development"
}
