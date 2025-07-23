variable "is_github_action" {
  type        = bool
  default     = false
  description = "Whether terraform is run within GitHub action"
}

variable "app_version" {
  type        = string
  default     = "unknown"
  description = "What version of a release is deployed"
}

variable "alarms_slack_channel_id" {
  type        = string
  default     = ""
  description = "Channel ID of the Slack channel where alarms would be sent"
}
